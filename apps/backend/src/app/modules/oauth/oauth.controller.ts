import { Controller, Get, HttpCode, Res, Query, Param, Req } from "@nestjs/common";
import type { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import { OpenAuthService } from "./oauth.service";
import { LuciaService } from "@db/client";
import { oAuthCookieNames, sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Controller("oauth")
export class OpenAuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly openAuthService: OpenAuthService,
		private readonly luciaService: LuciaService,
	) {}

	private setCSRFCookie(res: Response, cookieName: string, state: string) {
		res.cookie(cookieName, state, {
			httpOnly: true,
			secure: this.configService.get<string>("NODE_ENV") === "production",
			sameSite: "lax",
			expires: new Date(Date.now() + 1000 * 60 * 5),
		});
	}

	@Get(":provider")
	@HttpCode(200)
	async getAuthUrl(@Param("provider") provider: string, @Res({ passthrough: true }) res: Response) {
		switch (provider) {
			case "discord": {
				const { url, state } = await this.openAuthService.getDiscordAuthUrl();
				this.setCSRFCookie(res, oAuthCookieNames.discord.state, state);
				return { url };
			}
			case "google": {
				const { url, state, codeVerifier } = await this.openAuthService.getGoogleAuthUrl();
				this.setCSRFCookie(res, oAuthCookieNames.google.state, state);
				this.setCSRFCookie(res, oAuthCookieNames.google.codeVerifier, codeVerifier);
				return { url };
			}
			case "github": {
				const { url, state } = await this.openAuthService.getGitHubAuthUrl();
				this.setCSRFCookie(res, oAuthCookieNames.github.state, state);
				return { url };
			}

			default:
				throw new AppError(AppErrorTypes.InvalidProvider);
		}
	}

	@Get("callback/:provider")
	async callback(
		@Param("provider") provider: string,
		@Query("code") code: string | undefined,
		@Query("state") state: string | undefined,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		switch (provider) {
			case "discord": {
				const stateCookie = req.cookies[oAuthCookieNames.discord.state];
				if (!stateCookie) {
					throw new AppError(AppErrorTypes.InvalidState);
				}

				res.clearCookie(oAuthCookieNames.discord.state);
				if (stateCookie !== state) {
					throw new AppError(AppErrorTypes.InvalidState);
				}
				const cookie = await this.openAuthService.handleDiscordCallback(code);

				this.luciaService.setSessionCookie(res, sessionCookieName, cookie);
				return res.redirect(this.configService.get<string>("FRONTEND_URL") as string);
			}

			case "google": {
				const stateCookie = req.cookies[oAuthCookieNames.google.state];
				const codeVerifierCookie = req.cookies[oAuthCookieNames.google.codeVerifier];
				if (!stateCookie || !codeVerifierCookie) {
					throw new AppError(AppErrorTypes.InvalidState);
				}

				res.clearCookie(oAuthCookieNames.google.state);
				res.clearCookie(oAuthCookieNames.google.codeVerifier);
				if (stateCookie !== state) {
					throw new AppError(AppErrorTypes.InvalidState);
				}
				const cookie = await this.openAuthService.handleGoogleCallback(code, codeVerifierCookie);

				this.luciaService.setSessionCookie(res, sessionCookieName, cookie);
				return res.redirect(this.configService.get<string>("FRONTEND_URL") as string);
			}
			case "github": {
				const stateCookie = req.cookies[oAuthCookieNames.github.state];
				if (!stateCookie) {
					throw new AppError(AppErrorTypes.InvalidState);
				}

				res.clearCookie(oAuthCookieNames.github.state);
				if (stateCookie !== state) {
					throw new AppError(AppErrorTypes.InvalidState);
				}
				const cookie = await this.openAuthService.handleGitHubCallback(code);

				this.luciaService.setSessionCookie(res, sessionCookieName, cookie);
				return res.redirect(this.configService.get<string>("FRONTEND_URL") as string);
			}
			default:
				throw new AppError(AppErrorTypes.InvalidProvider);
		}
	}
}
