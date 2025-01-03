import { Injectable } from "@nestjs/common";
import {
	generateState,
	generateCodeVerifier,
	Discord,
	Google,
	GitHub,
	type OAuth2Tokens,
} from "arctic";
import type { TokenCookie } from "@shared/common/types";
import { validateSchema } from "@utils/validateSchema";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { ConfigService } from "@nestjs/config";
import type {
	DiscordUser,
	GoogleUser,
	GitHubUser,
	InitOAuthData,
	OAuthUser,
	OAuthProvider,
} from "./types";
import { DiscordUserSchema, GoogleUserSchema, GitHubUserSchema } from "./constants";
import type { z } from "zod";

@Injectable()
export class OpenAuthService {
	private discord!: Discord;
	private google!: Google;
	private github!: GitHub;

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}

	onModuleInit() {
		this.discord = new Discord(
			this.configService.get<string>("DISCORD_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("DISCORD_OAUTH_CLIENT_SECRET") as string,
			this.configService.get<string>("DISCORD_OAUTH_REDIRECT_URI") as string,
		);
		this.google = new Google(
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_SECRET") as string,
			this.configService.get<string>("GOOGLE_OAUTH_REDIRECT_URI") as string,
		);
		this.github = new GitHub(
			this.configService.get<string>("GITHUB_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("GITHUB_OAUTH_CLIENT_SECRET") as string,
			null,
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
			try {
				await this.prisma.oAuthAccount.create({
					data: {
						providerId: provider,
						providerUserId: id,
						userId: user.id,
					},
				});
			} catch (error) {
				handleDatabaseError(error);
			}

			return await this.makeSessionCookie(user.id);
		}

		// if user does not exist, create new user, oauth account, and session

		try {
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
		} catch (error) {
			handleDatabaseError(error);
		}
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
				case "discord":
					return await this.discord.validateAuthorizationCode(code);
				case "google":
					if (codeVerifier === undefined) {
						throw new AppError(
							AppErrorTypes.GenericError("Missing codeVerifier from OAuth provider"),
						);
					}
					return await this.google.validateAuthorizationCode(code, codeVerifier);
				case "github":
					return await this.github.validateAuthorizationCode(code);
				default:
					throw new AppError(AppErrorTypes.GenericError("Unsupported OAuth provider"));
			}
		} catch (error) {
			let msg = "Failed to validate authorization code";
			if (error instanceof Error) msg += `: ${error.message}`;
			throw new AppError(AppErrorTypes.GenericError(msg));
		}
	}
	async getDiscordAuthUrl(): Promise<InitOAuthData> {
		const state = generateState();
		const url = this.discord.createAuthorizationURL(state, ["identify", "email"]);
		return { state, url: url.toString() };
	}

	async getGoogleAuthUrl(): Promise<Required<InitOAuthData>> {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = this.google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);
		return { state, codeVerifier, url: url.toString() };
	}

	async getGitHubAuthUrl(): Promise<InitOAuthData> {
		const state = generateState();
		const url = this.github.createAuthorizationURL(state, ["user:email"]);
		return { state, url: url.toString() };
	}

	async handleDiscordCallback(code: string | undefined): Promise<TokenCookie> {
		const tokens = await this.getOAuthTokens("discord", code);

		// get user info from discord
		const discordUser = await this.fetchUserDataFromOAuthProvider<DiscordUser>(
			"https://discord.com/api/users/@me",
			{
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
			DiscordUserSchema,
		);

		return await this.handleOAuth("discord", discordUser);
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

	async handleGitHubCallback(code: string | undefined): Promise<TokenCookie> {
		const tokens = await this.getOAuthTokens("github", code);
		// get user info from github
		const githubUser = await this.fetchUserDataFromOAuthProvider<GitHubUser>(
			"https://api.github.com/user",
			{
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
			GitHubUserSchema,
		);

		return await this.handleOAuth("github", {
			id: githubUser.id.toString(),
			email: githubUser.email,
			username: githubUser.login,
		});
	}
}
