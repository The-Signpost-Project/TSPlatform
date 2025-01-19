import { z } from "zod";
import type {
	CreatePeddlerInput,
	UpdatePeddlerInput,
	CreateDisabilityInput,
	UpdateDisabilityInput,
	CreateRegionInput,
	UpdateRegionInput,
	Region,
} from "@shared/common/types";

export const CreatePeddlerInputSchema = z.object({
	mainRegionId: z.string(),
	firstName: z.string().nullable(),
	lastName: z.string(),
	race: z.enum(["Chinese", "Malay", "Indian", "Others"]),
	sex: z.enum(["M", "F"]),
	birthYear: z.number(),
	disabilityIds: z.array(z.string()),
}) satisfies z.ZodType<CreatePeddlerInput>;

export const UpdatePeddlerInputSchema =
	CreatePeddlerInputSchema.partial() satisfies z.ZodType<UpdatePeddlerInput>;

export const CreateDisabilityInputSchema = z.object({
	name: z.string().min(1),
}) satisfies z.ZodType<CreateDisabilityInput>;

export const UpdateDisabilityInputSchema = z.object({
	name: z.string().min(1).optional(),
}) satisfies z.ZodType<UpdateDisabilityInput>;

export const RegionSchema = z.object({
	id: z.string(),
	name: z.string(),
	photoPath: z.string().nullable(),
}) satisfies z.ZodType<Region>;

export const CreateRegionInputSchema = z.object({
	name: z.string().min(1),
}) satisfies z.ZodType<Omit<CreateRegionInput, "photo">>;

export const UpdateRegionInputSchema = z.object({
	name: z.string().min(1).optional(),
}) satisfies z.ZodType<UpdateRegionInput>;
