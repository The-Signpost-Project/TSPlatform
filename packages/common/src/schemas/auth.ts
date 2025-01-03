import { z } from "zod";
import type {
	SignUpInput,
	SignInInput,
	ForgotPasswordEmail,
	ForgotPasswordReset,
	VerifyEmail,
	ChangePasswordInput,
} from "@shared/common/types";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
const whitespaceRegex = /\s/;

const passwordSchema = z
	.string()
	.min(8)
	.max(100)
	.refine((pw) => uppercaseRegex.test(pw), {
		message: "Password must contain at least one uppercase letter",
	})
	.refine((pw) => lowercaseRegex.test(pw), {
		message: "Password must contain at least one lowercase letter",
	})
	.refine((pw) => numberRegex.test(pw), {
		message: "Password must contain at least one number",
	})
	.refine((pw) => specialCharRegex.test(pw), {
		message: "Password must contain at least one special character",
	})
	.refine((pw) => !whitespaceRegex.test(pw), {
		message: "Password must not contain any whitespace",
	});

export const SignUpInputSchema = z
	.object({
		username: z.string().min(3).max(100),
		email: z.string().email(),
		password: passwordSchema,
		repeatPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.repeatPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Passwords do not match",
				path: ["repeatPassword"], // Attach the error to the repeatPassword field
			});
		}
	}) satisfies z.ZodType<SignUpInput>;

export const SignInInputSchema = z.object({
	email: z.string().email(),
	password: z.string(),
}) satisfies z.ZodType<SignInInput>;

export const UserIdSchema = z.string();

export const TokenIdSchema = z.string().length(64);

export const ForgotPasswordEmailSchema = z.object({
	email: z.string().email(),
}) satisfies z.ZodType<ForgotPasswordEmail>;

export const ForgotPasswordResetSchema = z.object({
	token: z.string(),
	newPassword: passwordSchema,
}) satisfies z.ZodType<ForgotPasswordReset>;

export const VerifyEmailSchema = z.object({
	id: z.string(),
}) satisfies z.ZodType<VerifyEmail>;

export const EmailVerificationTokenSchema = z.string() satisfies z.ZodType<string>;

export const ChangePasswordInputSchema = z
	.object({
		oldPassword: z.string().optional(),
		newPassword: passwordSchema,
		repeatPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.newPassword !== data.repeatPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Passwords do not match",
				path: ["repeatPassword"], // Attach the error to the repeatPassword field
			});
		}
	}) satisfies z.ZodType<ChangePasswordInput>;
