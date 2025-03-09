import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { createTransport } from "nodemailer";
import { compile, type TemplateDelegate } from "handlebars";
import { readdirSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import { google } from "googleapis";
import { Templater } from "@base";

@Injectable()
export class EmailService extends Templater {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {
		super();
		this.alertAddresses = this.config.get<string>("EMAIL_ALERT_ADDRESSES")?.split(",") ?? [];
	}

	private emailFrom!: string;
	private emailTemplates!: Record<string, TemplateDelegate>;
	private oAuth2Client!: InstanceType<typeof google.auth.OAuth2>;
	private readonly alertAddresses: string[];

	private compileTemplatesFromDir(dir: string) {
		const templates = readdirSync(dir);
		return templates.reduce(
			(acc, template) => {
				const templatePath = join(dir, template);
				const templateContent = readFileSync(templatePath, "utf-8");
				const compiledTemplate = compile(templateContent);
				acc[template] = compiledTemplate;
				return acc;
			},
			{} as Record<string, TemplateDelegate>,
		);
	}

	private getOAuth2Client() {
		const oauth2Client = new google.auth.OAuth2(
			this.config.get<string>("GOOGLE_OAUTH_CLIENT_ID") ?? "",
			this.config.get<string>("GOOGLE_OAUTH_CLIENT_SECRET") ?? "",
			this.config.get<string>("GOOGLE_OAUTH_EMAIL_REDIRECT_URI") ?? "",
		);
		oauth2Client.setCredentials({
			refresh_token: this.config.get<string>("GOOGLE_OAUTH_EMAIL_REFRESH_TOKEN") ?? "",
		});
		return oauth2Client;
	}

	onModuleInit() {
		this.oAuth2Client = this.getOAuth2Client();

		this.emailFrom = this.config.get<string>("GOOGLE_OAUTH_EMAIL_USER") ?? "";

		this.emailTemplates = this.compileTemplatesFromDir(join(this.publicDir, "emailTemplates"));
	}

	private async sendEmail(
		to: string,
		subject: string,
		template: string,
		context: Record<string, unknown>,
	) {
		if (!this.emailTemplates[template]) {
			throw new AppError(AppErrorTypes.Panic(`Email template ${template} not found`));
		}
		const html = this.emailTemplates[template](context);

		// get the access token (this is short-lived)
		let accessToken: string | null | undefined;
		try {
			accessToken = (await this.oAuth2Client.getAccessToken()).token;
		} catch (error) {
			if (error instanceof Error) {
				throw new AppError(AppErrorTypes.Panic(error.message));
			}
			throw new AppError(
				AppErrorTypes.Panic("Failed to get access token, email not sent. Please try again later."),
			);
		}
		if (!accessToken) {
			throw new AppError(
				AppErrorTypes.Panic("Failed to get access token, email not sent. Please try again later."),
			);
		}
		// set the access token in the transporter options

		const transporter = createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: this.config.get<string>("GOOGLE_OAUTH_EMAIL_USER") ?? "",
				clientId: this.config.get<string>("GOOGLE_OAUTH_CLIENT_ID") ?? "",

				clientSecret: this.config.get<string>("GOOGLE_OAUTH_CLIENT_SECRET") ?? "",
				refreshToken: this.config.get<string>("GOOGLE_OAUTH_REFRESH_TOKEN") ?? "",
				accessToken,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
		try {
			await transporter.sendMail({
				from: this.emailFrom,
				to,
				subject,
				html,
			});
		} catch (error) {
			console.error(error);
			throw new AppError(AppErrorTypes.Panic("Failed to send email. Please try again later."));
		}
	}

	private static readonly passwordResetTokenExpiry = 1000 * 60 * 5; // 5 minutes

	async sendForgotPasswordEmail(email: string) {
		// in this case, it doesnt matter if password hash exists or not
		// users who have not set a password yet can still reset their password
		// users without an email address cannot reset their password
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// upsert a new password reset token

		const token = await this.prisma.passwordResetToken.upsert({
			where: {
				userId: user.id,
			},
			update: {
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + EmailService.passwordResetTokenExpiry), // 5 minutes
			},
			create: {
				userId: user.id,
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + EmailService.passwordResetTokenExpiry), // 5 minutes
			},
		});

		// send email
		await this.sendEmail(email, "Reset your password", "forgotPassword.hbs", {
			username: user.username,
			url: `${this.config.get<string>("FRONTEND_URL")}/auth/reset-password/${token.token}`,
		});
	}

	private static readonly verificationTokenExpiry = 1000 * 60 * 60; // 1 hour

	async sendVerificationEmail(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		if (!user.email) {
			throw new AppError(AppErrorTypes.NoEmail);
		}

		if (user.verified) {
			throw new AppError(AppErrorTypes.AlreadyVerified);
		}

		// upsert a new verification token

		const token = await this.prisma.verificationToken.upsert({
			where: {
				userId: user.id,
			},
			update: {
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + EmailService.verificationTokenExpiry),
			},
			create: {
				userId: user.id,
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + EmailService.verificationTokenExpiry),
			},
		});

		await this.sendEmail(user.email, "Verify your email", "verify.hbs", {
			username: user.username,
			url: `${this.config.get<string>("BACKEND_PUBLIC_URL")}/auth/verify/${token.token}`,
		});
	}

	async sendUrgentCaseEmail(caseId: string) {
		const caseData = await this.prisma.case.findUnique({
			where: { id: caseId },
			include: { region: true, peddler: true },
		});
		if (!caseData) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		const kv = [
			{
				key: "Date",
				value: caseData.createdAt.toDateString(),
			},
			{
				key: "Region",
				value: caseData.region.name,
			},
			{
				key: "Codename",
				value: caseData.peddler.codename,
			},
			{
				key: "Notes and Details",
				value: caseData.notes,
			},
			{
				key: "Importance",
				value: caseData.importance,
			},
		];
		await Promise.all(
			this.alertAddresses.map(async (email) => {
				await this.sendEmail(email, "Urgent Case Alert", "urgentCase.hbs", {
					attributes: kv,
					viewFullUrl: `${this.config.get<string>("FRONTEND_URL")}/cases/${caseId}`,
				});
			}),
		);
	}

	async sendNewPeddlerEmail(peddlerId: string) {
		const peddler = await this.prisma.peddler.findUnique({
			where: { id: peddlerId },
			include: {
				mainRegion: true,
				disabilities: {
					select: {
						disability: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});
		if (!peddler) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		const kv = [
			{
				key: "Codename",
				value: peddler.codename,
			},
			{
				key: "Region",
				value: peddler.mainRegion.name,
			},
			{
				key: "Surname/Name of individual",
				value: peddler.lastName,
			},
			{
				key: "First Name",
				value: peddler.firstName ?? "N/A",
			},
			{
				key: "Race",
				value: peddler.race,
			},
			{
				key: "Sex",
				value: peddler.sex,
			},
			{
				key: "Date of Birth",
				value: peddler.birthYear,
			},
			{
				key: "Remarks",
				value: peddler.remarks ?? "N/A",
			},
			{
				key: "Disabilities",
				value:
					peddler.disabilities.length > 0
						? peddler.disabilities.map((d) => d.disability.name).join(", ")
						: "None",
			},
		];
		await Promise.all(
			this.alertAddresses.map(async (email) => {
				await this.sendEmail(email, "New Peddler Alert", "newPeddler.hbs", {
					attributes: kv,
					viewFullUrl: `${this.config.get<string>("FRONTEND_URL")}/peddlers/${peddlerId}`,
				});
			}),
		);
	}
}
