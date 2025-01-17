import type { StrictCase, CreateCaseInput } from "@shared/common/types";
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
}) satisfies z.ZodType<Omit<CreateCaseInput, 'photos'>>;