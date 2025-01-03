import { z } from "zod";
import type { DiscordUser, GoogleUser, GitHubUser } from "./types";

export const DiscordUserSchema = z.object({
	id: z.string(),
	email: z.string().nullable(),
	username: z.string(),
}) satisfies z.ZodType<DiscordUser>;

export const GoogleUserSchema = z.object({
	sub: z.string(),
	email: z.string().nullable(),
	name: z.string(),
}) satisfies z.ZodType<GoogleUser>;

export const GitHubUserSchema = z.object({
	id: z.number(),
	email: z.string().nullable(),
	login: z.string(),
}) satisfies z.ZodType<GitHubUser>;
