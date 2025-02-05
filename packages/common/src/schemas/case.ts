import type { StrictCase, CreateCaseInput, CaseFilters } from "@shared/common/types";
import { z } from "zod";

export const StrictCaseSchema = z.object({
	id: z.string(),
	createdById: z.string(),
	createdByUsername: z.string(),
	regionId: z.string(),
	regionName: z.string(),
	interactionDate: z.coerce.date(),
	location: z.string(),
	notes: z.string(),
	importance: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
	firstInteraction: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	photoPaths: z.array(z.string()),
	peddlerId: z.string(),
	peddlerCodename: z.string(),
}) satisfies z.ZodType<StrictCase>;

export const CreateCaseInputSchema = z.object({
	createdById: z.string().min(1),
	regionId: z.string().min(1),
	interactionDate: z.coerce.date(),
	location: z.string().min(1),
	notes: z.string().min(1),
	importance: z.coerce.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
	firstInteraction: z.coerce.boolean(),
	peddlerId: z.string().min(1),
}) satisfies z.ZodType<Omit<CreateCaseInput, "photos">>;

export const UpdateCaseInputSchema = CreateCaseInputSchema.partial();

export const CaseFiltersSchema = z
	.object({
		regionId: z.string().optional(),
		teamId: z.string().optional(),
		peddlerId: z.string().optional(),
		// a string of comma separated numbers from 1 to 5
		importance: z
			.string()
			.regex(/^[1-5](,[1-5])*$/)
			.optional(),

		limit: z.coerce.number().int().positive().optional(),
		offset: z.coerce.number().int().nonnegative().optional(),
		sortBy: z
			.union([z.literal("updatedAt"), z.literal("interactionDate"), z.literal("importance")])
			.optional(),
		order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
	})
	.refine(
		(v) =>
			(v.limit === undefined && v.offset === undefined) ||
			(v.limit !== undefined && v.offset !== undefined),
		{
			message: "Both limit and offset must be provided",
			path: ["limit", "offset"],
		},
	)
	.refine(
		(v) =>
			(v.sortBy === undefined && v.order === undefined) ||
			(v.sortBy !== undefined && v.order !== undefined),
		{
			message: "Both sortBy and order must be provided",
			path: ["sortBy", "order"],
		},
	) satisfies z.ZodType<Omit<CaseFilters, "importance">>;
