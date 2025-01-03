import type {
	GetUserInput,
	UpdateUserInput,
	SafeUser,
	DeleteUserInput,
} from "@shared/common/types";
import { z } from "zod";

export const GetUserInputSchema = z.string() satisfies z.ZodType<GetUserInput>;

export const UpdateUserInputSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
	verified: z.boolean().optional(),
	theme: z.string().optional(),
	reducedMotion: z.boolean().optional(),
	timezone: z.string().optional(),
}) satisfies z.ZodType<UpdateUserInput>;

export const DeleteUserInputSchema = z.object({
	username: z.string(),
}) satisfies z.ZodType<DeleteUserInput>;

export const SafeUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string().email().nullable(),
	verified: z.boolean(),
	oAuthProviders: z.enum(["discord", "google", "github"]).array(),
	hasPassword: z.boolean(),
	allowMarketing: z.boolean(),
	timezone: z.string(),
	createdAt: z.coerce.date(),
}) satisfies z.ZodType<SafeUser>;
