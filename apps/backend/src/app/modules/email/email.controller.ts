import { Controller, Post, Body, HttpCode, UseGuards } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ValidationPipe } from "@pipes";
import { ForgotPasswordEmailSchema, VerifyEmailSchema } from "@shared/common/schemas";
import type { ForgotPasswordEmail, VerifyEmail } from "@shared/common/types";
import { AuthGuard } from "@guards";

@Controller("email")
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post("forgot-password")
	@HttpCode(201)
	async sendForgotPasswordEmail(
		@Body(new ValidationPipe(ForgotPasswordEmailSchema)) { email }: ForgotPasswordEmail,
	) {
		await this.emailService.sendForgotPasswordEmail(email);
	}

	@Post("verify")
	@UseGuards(AuthGuard("body", "id"))
	@HttpCode(201)
	async sendVerificationEmail(@Body(new ValidationPipe(VerifyEmailSchema)) { id }: VerifyEmail) {
		await this.emailService.sendVerificationEmail(id);
	}
}
