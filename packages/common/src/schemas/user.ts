import type {
	UpdateUserInput,
	SafeUser,
	DeleteUserInput,
	UpdateUserRolesInput,
	Team,
	CreateTeamInput,
	UserTeamInput,
} from "@shared/common/types";
import { StrictRoleSchema } from "./role";
import { z } from "zod";

export const UpdateUserInputSchema = z.object({
	username: z.string().optional(),
	email: z.email().optional(),
	verified: z.boolean().optional(),
	allowEmailNotifications: z.boolean().optional(),
}) satisfies z.ZodType<UpdateUserInput>;

export const UpdateUserRolesInputSchema = z.object({
	roles: z.array(z.object({ roleId: z.string() })).optional(),
}) satisfies z.ZodType<UpdateUserRolesInput>;

export const DeleteUserInputSchema = z.object({
	username: z.string(),
}) satisfies z.ZodType<DeleteUserInput>;

export const SafeUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.email().nullable(),
	verified: z.boolean(),
	oAuthProviders: z.enum(["google"]).array(),
	hasPassword: z.boolean(),
	allowEmailNotifications: z.boolean(),
	createdAt: z.coerce.date(),
	roles: z.array(StrictRoleSchema),
}) satisfies z.ZodType<SafeUser>;

export const TeamSchema = z.object({
	id: z.string(),
	name: z.string(),
	photoPath: z.string().nullable(),
	members: SafeUserSchema.omit({ roles: true }).array(),
}) satisfies z.ZodType<Team>;

export const CreateTeamInputSchema = z.object({
	name: z.string(),
}) satisfies z.ZodType<Omit<CreateTeamInput, "photo">>;

export const UpdateTeamInputSchema = CreateTeamInputSchema.partial();

export const UserTeamInputSchema = z.object({
	userId: z.string(),
}) satisfies z.ZodType<UserTeamInput>;
