import { z } from "zod";
import { CreateCaseInputSchema, CreatePeddlerInputSchema } from "@shared/common/schemas";
import type { CreateCaseInput, CreatePeddlerInput } from "@shared/common/types";

// for general case details
const CombinedCaseFormSection1Schema = z.object({
	interactionDate: z.date(),
	regionId: z.string().nonempty(),
	location: z.string().nonempty(),
	notes: z.string().nonempty(),
	importance: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
	firstInteraction: z.boolean(),
}) satisfies z.ZodType<Omit<CreateCaseInput, "photos" | "createdById" | "peddlerId">>;

// for new peddler details
const CombinedCaseFormSection2ASchema = CreatePeddlerInputSchema;

// for existing peddler details
const CombinedCaseFormSection2BSchema = z.object({
	peddlerId: z.string().nonempty(),
}) satisfies z.ZodType<Pick<CreateCaseInput, "peddlerId">>;

export const CombinedCaseFormSchema = z.intersection(
	CombinedCaseFormSection1Schema,
	z.union([CombinedCaseFormSection2ASchema, CombinedCaseFormSection2BSchema]),
);
