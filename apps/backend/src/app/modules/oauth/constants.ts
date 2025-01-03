import { z } from "zod";
import type { GoogleUser } from "./types";

export const GoogleUserSchema = z.object({
	sub: z.string(),
	email: z.string().nullable(),
	name: z.string(),
}) satisfies z.ZodType<GoogleUser>;
