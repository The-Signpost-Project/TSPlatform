import type {
	GetUserInput,
	UpdateUserInput,
	SafeUser,
	DeleteUserInput,
} from "@shared/common/types";
import { StrictRoleSchema } from "./role";
import { z } from "zod";

export const GetUserInputSchema = z.string() satisfies z.ZodType<GetUserInput>;

export const UpdateUserInputSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
	verified: z.boolean().optional(),
	allowEmailNotifications: z.boolean().optional(),
	roles: z.array(z.object({ roleId: z.string() })).optional(),
}) satisfies z.ZodType<UpdateUserInput>;

export const DeleteUserInputSchema = z.object({
	username: z.string(),
}) satisfies z.ZodType<DeleteUserInput>;

export const SafeUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string().email().nullable(),
	verified: z.boolean(),
	oAuthProviders: z.enum(["google"]).array(),
	hasPassword: z.boolean(),
	allowEmailNotifications: z.boolean(),
	createdAt: z.coerce.date(),
	roles: z.array(StrictRoleSchema),
}) satisfies z.ZodType<SafeUser>;
