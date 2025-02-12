import { Controller, Post, Body, HttpCode, UseGuards, Param } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ValidationPipe } from "@pipes";
import { ForgotPasswordEmailSchema, VerifyEmailSchema } from "@shared/common/schemas";
import type { ForgotPasswordEmail, VerifyEmail } from "@shared/common/types";
import { SelfServeGuard } from "@guards";
import { NonEmptyStringSchema } from "@shared/common/schemas";

@Controller("email")
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post("forgot-password")
	async sendForgotPasswordEmail(
		@Body(new ValidationPipe(ForgotPasswordEmailSchema)) { email }: ForgotPasswordEmail,
	) {
		await this.emailService.sendForgotPasswordEmail(email);
	}

	@Post("verify")
	@UseGuards(SelfServeGuard("body", "id"))
	async sendVerificationEmail(@Body(new ValidationPipe(VerifyEmailSchema)) { id }: VerifyEmail) {
		await this.emailService.sendVerificationEmail(id);
	}

	@Post("urgent-case/:caseId")
	async sendUrgentCaseEmail(
		@Param("caseId", new ValidationPipe(NonEmptyStringSchema)) caseId: string,
	) {
		await this.emailService.sendUrgentCaseEmail(caseId);
	}

	@Post("new-peddler/:peddlerId")
	async sendNewPeddlerEmail(
		@Param("peddlerId", new ValidationPipe(NonEmptyStringSchema)) peddlerId: string,
	) {
		await this.emailService.sendNewPeddlerEmail(peddlerId);
	}
}
