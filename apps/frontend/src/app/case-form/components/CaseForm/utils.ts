import { z } from "zod";
import { CreatePeddlerInputSchema } from "@shared/common/schemas";
import type { CreateCaseInput, CreatePeddlerInput } from "@shared/common/types";
import type { CaseFormValues } from "./types";

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
const CombinedCaseFormSection2ASchema = CreatePeddlerInputSchema.pick({
	lastName: true,
	firstName: true,
	race: true,
	sex: true,
	birthYear: true,
	disabilityIds: true,
	remarks: true,
}) satisfies z.ZodType<Omit<CreatePeddlerInput, "mainRegionId">>;

// for existing peddler details
const CombinedCaseFormSection2BSchema = z.object({
	peddlerId: z.string().nonempty(),
}) satisfies z.ZodType<Pick<CreateCaseInput, "peddlerId">>;

export const CombinedCaseFormSchema = z.intersection(
	CombinedCaseFormSection1Schema,
	z.union([CombinedCaseFormSection2ASchema, CombinedCaseFormSection2BSchema]),
) as z.ZodType<CaseFormValues>;
