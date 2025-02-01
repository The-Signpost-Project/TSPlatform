import { Injectable } from "@nestjs/common";
import { generateState, generateCodeVerifier, Google, type OAuth2Tokens } from "arctic";
import type { TokenCookie, OAuthProvider } from "@shared/common/types";
import { validateSchema } from "@utils/validateSchema";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { ConfigService } from "@nestjs/config";
import type { GoogleUser, InitOAuthData, OAuthUser } from "./types";
import { GoogleUserSchema } from "./constants";
import type { z } from "zod";

@Injectable()
export class OpenAuthService {
	private google!: Google;

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}

	onModuleInit() {
		this.google = new Google(
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_SECRET") as string,
			this.configService.get<string>("GOOGLE_OAUTH_REDIRECT_URI") as string,
		);
	}

	private async fetchUserDataFromOAuthProvider<T>(
		url: string,
		headers: Record<string, string>,
		schema: z.ZodType<T>,
	): Promise<T> {
		try {
			const response = await fetch(url, {
				headers,
			});
			const data = await response.json();
			return validateSchema(schema, data);
		} catch {
			throw new AppError(
				AppErrorTypes.GenericError("Failed to fetch user info from OAuth provider"),
			);
		}
	}

	private async makeSessionCookie(userId: string): Promise<TokenCookie> {
		const token = this.lucia.generateSessionToken();
		const session = await this.lucia.createSession(token, userId);
		return {
			value: token,
			expiresAt: session.expiresAt,
		};
	}

	private async handleOAuth(
		provider: OAuthProvider,
		{ id, email, username }: OAuthUser,
	): Promise<TokenCookie> {
		// check if oauth account exists
		const oAuthAccount = await this.prisma.oAuthAccount.findFirst({
			where: {
				providerId: provider,
				providerUserId: id,
			},
			include: {
				user: true,
			},
		});

		// if oauth account exists, create session and return session cookie (sign in)
		if (oAuthAccount) return await this.makeSessionCookie(oAuthAccount.user.id);

		// if oauth account does not exist, check if user exists
		const user = await this.prisma.user.findFirst({
			where: {
				email,
			},
		});

		// if user exists, create oauth account and session. link user to oauth account
		if (user) {
			await this.prisma.oAuthAccount.create({
				data: {
					providerId: provider,
					providerUserId: id,
					userId: user.id,
				},
			});

			return await this.makeSessionCookie(user.id);
		}

		// if user does not exist, create new user, oauth account, and session

		const userId = this.lucia.generateUserId();

		await this.prisma.user.create({
			data: {
				id: userId,
				username,
				email,
			},
		});

		await this.prisma.oAuthAccount.create({
			data: {
				providerId: provider,
				providerUserId: id,
				userId,
			},
		});

		return await this.makeSessionCookie(userId);
	}

	private async getOAuthTokens(
		provider: OAuthProvider,
		code?: string,
		codeVerifier?: string,
	): Promise<OAuth2Tokens> {
		if (code === undefined) {
			throw new AppError(AppErrorTypes.GenericError("Missing code from OAuth provider"));
		}
		try {
			switch (provider) {
				case "google":
					if (codeVerifier === undefined) {
						throw new AppError(
							AppErrorTypes.GenericError("Missing codeVerifier from OAuth provider"),
						);
					}
					return await this.google.validateAuthorizationCode(code, codeVerifier);

				default:
					throw new AppError(AppErrorTypes.GenericError("Unsupported OAuth provider"));
			}
		} catch (error) {
			let msg = "Failed to validate authorization code";
			if (error instanceof Error) msg += `: ${error.message}`;
			throw new AppError(AppErrorTypes.GenericError(msg));
		}
	}

	async getGoogleAuthUrl(): Promise<Required<InitOAuthData>> {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = this.google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);
		return { state, codeVerifier, url: url.toString() };
	}

	async handleGoogleCallback(
		code: string | undefined,
		codeVerifier: string | undefined,
	): Promise<TokenCookie> {
		const tokens = await this.getOAuthTokens("google", code, codeVerifier);

		// get user info from google
		const googleUser = await this.fetchUserDataFromOAuthProvider<GoogleUser>(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
			GoogleUserSchema,
		);

		return await this.handleOAuth("google", {
			id: googleUser.sub,
			email: googleUser.email,
			username: googleUser.name,
		});
	}
}
