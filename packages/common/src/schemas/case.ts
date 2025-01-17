import type { StrictCase, CreateCaseInput, CaseFilters } from "@shared/common/types";
import { z } from "zod";

export const StrictCaseSchema = z.object({
	id: z.string(),
	createdById: z.string(),
	createdByUsername: z.string(),
	regionId: z.string(),
	regionName: z.string(),
	interactionDate: z.date(),
	location: z.string(),
	notes: z.string(),
	importance: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
	firstInteraction: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	photoPaths: z.array(z.string()),
	peddlerId: z.string(),
	peddlerCodename: z.string(),
}) satisfies z.ZodType<StrictCase>;

export const CreateCaseInputSchema = z.object({
	createdById: z.string(),
	regionId: z.string(),
	interactionDate: z.date(),
	location: z.string(),
	notes: z.string(),
	importance: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
	firstInteraction: z.boolean(),
	peddlerId: z.string(),
}) satisfies z.ZodType<Omit<CreateCaseInput, "photos">>;

export const CaseFiltersSchema = z
	.object({
		region: z.string().optional(),
		team: z.string().optional(),
		peddler: z.string().optional(),
		importance: z.number().int().min(1).max(5).optional() as z.ZodType<
			1 | 2 | 3 | 4 | 5 | undefined
		>,

		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		sortBy: z
			.union([z.literal("updatedAt"), z.literal("interactionDate"), z.literal("importance")])
			.optional(),
		order: z.union([z.literal("ASC"), z.literal("DESC")]).optional(),
	})
	.refine((v) => v.limit !== undefined && v.offset !== undefined, {
		message: "Both limit and offset must be provided",
		path: ["limit", "offset"],
	})
	.refine((v) => v.sortBy !== undefined && v.order !== undefined, {
		message: "Both sortBy and order must be provided",
		path: ["sortBy", "order"],
	}) satisfies z.ZodType<CaseFilters>;
