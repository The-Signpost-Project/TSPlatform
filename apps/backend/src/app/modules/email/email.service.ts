import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { createTransport, type Transporter } from "nodemailer";
import { compile, type TemplateDelegate } from "handlebars";
import { readdirSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

@Injectable()
export class EmailService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {}

	private transporter!: Transporter;
	private emailFrom!: string;
	private emailTemplates!: Record<string, TemplateDelegate>;

	private compileTemplatesFromDir(dir: string) {
		const templates = readdirSync(dir);
		return templates.reduce(
			(acc, template) => {
				const templatePath = `${dir}/${template}`;
				const templateContent = readFileSync(templatePath, "utf-8");
				const compiledTemplate = compile(templateContent);
				acc[template] = compiledTemplate;
				return acc;
			},
			{} as Record<string, TemplateDelegate>,
		);
	}

	onModuleInit() {
		this.transporter = createTransport({
			host: this.config.get<string>("EMAIL_HOST"),
			port: this.config.get<number>("EMAIL_PORT"),
			secure: this.config.get<boolean>("EMAIL_SECURE"),
			auth: {
				user: this.config.get<string>("EMAIL_USER"),
				pass: this.config.get<string>("EMAIL_PASSWORD"),
			},
		});
		this.emailFrom = this.config.get<string>("EMAIL_USER") ?? "";

		this.emailTemplates = this.compileTemplatesFromDir(`${process.cwd()}/public/emailTemplates`);
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
		await this.transporter.sendMail({
			from: this.emailFrom,
			to,
			subject,
			html,
		});
	}

	async sendForgotPasswordEmail(email: string) {
		// in this case, it doesnt matter if password hash exists or not
		// users who have not set a password yet can still reset their password
		// users without an email address cannot reset their password
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// find any existing password reset token and delete it

		try {
			await this.prisma.passwordResetToken.delete({
				where: {
					userId: user.id,
				},
			});
		} catch {
			// ignore if token does not exist
		}

		// create a new password reset token

		const token = await this.prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
			},
		});

		// send email
		await this.sendEmail(email, "Reset your password", "forgotPassword.hbs", {
			username: user.username,
			url: `${this.config.get<string>("FRONTEND_URL")}/auth/reset-password/${token.token}`,
		});
	}

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

		try {
			await this.prisma.verificationToken.delete({
				where: {
					userId: user.id,
				},
			});
		} catch {
			// ignore if token does not exist
		}

		const token = await this.prisma.verificationToken.create({
			data: {
				userId: user.id,
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
			},
		});

		await this.sendEmail(user.email, "Verify your email", "verify.hbs", {
			username: user.username,
			url: `${this.config.get<string>("BACKEND_PUBLIC_URL")}/auth/verify/${token.token}`,
		});
	}
}
