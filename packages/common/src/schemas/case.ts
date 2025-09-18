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
	importance: z.int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
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
	firstInteraction: z.preprocess(
		(v) => (v === "true" ? true : v === "false" ? false : v),
		z.boolean(),
	) as z.ZodType<boolean>,
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
			path: ["limit", "offset"],
            error: "Both limit and offset must be provided"
        },
	)
	.refine(
		(v) =>
			(v.sortBy === undefined && v.order === undefined) ||
			(v.sortBy !== undefined && v.order !== undefined),
		{
			path: ["sortBy", "order"],
            error: "Both sortBy and order must be provided"
        },
	) satisfies z.ZodType<Omit<CaseFilters, "importance">>;
