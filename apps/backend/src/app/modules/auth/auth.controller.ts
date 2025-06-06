import {
	Controller,
	Get,
	Body,
	Post,
	HttpCode,
	Res,
	Delete,
	Param,
	UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import type {
	ForgotPasswordReset,
	SignInInput,
	SignUpInput,
	ChangePasswordInput,
} from "@shared/common/types";
import { sessionCookieName } from "@shared/common/constants";
import { AuthService } from "./auth.service";
import { LuciaService } from "@db/client";
import {
	SignUpInputSchema,
	SignInInputSchema,
	TokenIdSchema,
	ForgotPasswordResetSchema,
	ChangePasswordInputSchema,
	NonEmptyStringSchema,
} from "@shared/common/schemas";
import { ValidationPipe } from "@pipes";
import { ConfigService } from "@nestjs/config";
import { SelfServeGuard } from "@guards";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly luciaService: LuciaService,
		private readonly configService: ConfigService,
	) {}

	@Post("signup")
	async signUp(
		@Body(new ValidationPipe(SignUpInputSchema)) input: SignUpInput,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokenCookie = await this.authService.signUp(input);
		this.luciaService.setSessionCookie(res, sessionCookieName, tokenCookie);
	}

	@Post("signin")
	async signIn(
		@Body(new ValidationPipe(SignInInputSchema)) input: SignInInput,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokenCookie = await this.authService.signIn(input);
		this.luciaService.setSessionCookie(res, sessionCookieName, tokenCookie);
	}

	@Delete("signout/:tokenId")
	async signOut(@Param("tokenId", new ValidationPipe(TokenIdSchema)) tokenId: string) {
		await this.authService.signOut(tokenId);
	}

	@Post("change-password/:id")
	@UseGuards(SelfServeGuard("params", "id"))
	async changePassword(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(ChangePasswordInputSchema)) input: ChangePasswordInput,
	) {
		await this.authService.changePassword(id, input);
	}

	@Post("reset-password")
	@HttpCode(201)
	async resetPassword(
		@Body(new ValidationPipe(ForgotPasswordResetSchema)) input: ForgotPasswordReset,
	) {
		await this.authService.resetPassword(input);
	}

	@Get("verify/:token")
	async verifyEmail(
		@Param("token", new ValidationPipe(NonEmptyStringSchema)) token: string,
		@Res({ passthrough: true }) res: Response,
	) {
		await this.authService.verifyEmail(token);
		return res.redirect(this.configService.get<string>("FRONTEND_URL") as string);
	}
}
