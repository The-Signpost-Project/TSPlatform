import { z } from "zod";
import type {
	CreatePeddlerInput,
	UpdatePeddlerInput,
	CreateDisabilityInput,
	UpdateDisabilityInput,
	CreateRegionInput,
	UpdateRegionInput,
} from "@shared/common/types";

export const CreatePeddlerInputSchema = z.object({
	mainRegion: z.object({ id: z.string() }),
	firstName: z.string().nullable(),
	lastName: z.string(),
	race: z.enum(["Chinese", "Malay", "Indian", "Others"]),
	sex: z.enum(["M", "F"]),
	birthYear: z.number(),
	disabilities: z.array(z.object({ id: z.string() })),
}) satisfies z.ZodType<CreatePeddlerInput>;

export const UpdatePeddlerInputSchema = z.object({
	mainRegion: z.object({ id: z.string() }).optional(),
	firstName: z.string().nullable(),
	lastName: z.string().optional(),
	race: z.enum(["Chinese", "Malay", "Indian", "Others"]).optional(),
	sex: z.enum(["M", "F"]).optional(),
	birthYear: z.number().optional(),
	disabilities: z.array(z.object({ id: z.string() })).optional(),
}) satisfies z.ZodType<UpdatePeddlerInput>;

export const GetPeddlerInputSchema = z.string();

export const CreateDisabilityInputSchema = z.object({
	name: z.string().min(1),
}) satisfies z.ZodType<CreateDisabilityInput>;

export const UpdateDisabilityInputSchema = z.object({
	name: z.string().min(1).optional(),
}) satisfies z.ZodType<UpdateDisabilityInput>;

export const GetDisabilityInputSchema = z.string();

export const CreateRegionInputSchema = z.object({
	name: z.string().min(1),
}) satisfies z.ZodType<CreateRegionInput>;

export const UpdateRegionInputSchema = z.object({
	name: z.string().min(1).optional(),
}) satisfies z.ZodType<UpdateRegionInput>;

export const GetRegionInputSchema = z.string();
