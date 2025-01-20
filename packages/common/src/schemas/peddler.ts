import { z } from "zod";
import type {
	CreatePeddlerInput,
	UpdatePeddlerInput,
	CreateDisabilityInput,
	UpdateDisabilityInput,
	CreateRegionInput,
	UpdateRegionInput,
	Region,
	Disability,
	StrictPeddler,
} from "@shared/common/types";

export const PeddlerSchema = z.object({
	id: z.string(),
	codename: z
		.string()
		.regex(/^[a-zA-Z]+_[a-zA-Z]+_[MF]$/) as z.ZodType<`${string}_${string}_${"M" | "F"}`>,
	mainRegion: z.object({
		id: z.string(),
		name: z.string(),
	}),
	firstName: z.string().nullable(),
	lastName: z.string().min(1),
	race: z.enum(["Chinese", "Malay", "Indian", "Others"]),
	sex: z.enum(["M", "F"]),
	birthYear: z.string().min(1),
	createdAt: z.date(),
	disabilities: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
		}),
	),
}) satisfies z.ZodType<StrictPeddler>;

export const CreatePeddlerInputSchema = z.object({
	mainRegionId: z.string(),
	firstName: z.string().nullable(),
	lastName: z.string().min(1),
	race: z.enum(["Chinese", "Malay", "Indian", "Others"]),
	sex: z.enum(["M", "F"]),
	birthYear: z.string().min(1),
	disabilityIds: z.array(z.string()),
}) satisfies z.ZodType<CreatePeddlerInput>;

export const UpdatePeddlerInputSchema =
	CreatePeddlerInputSchema.partial() satisfies z.ZodType<UpdatePeddlerInput>;

export const DisabilitySchema = z.object({
	id: z.string(),
	name: z.string(),
}) satisfies z.ZodType<Disability>;

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
