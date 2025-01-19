import type { Region, Disability } from "@shared/common/types";
import type { z } from "zod";
import type { CombinedCaseFormSchema } from "./actions";

export interface CaseFormProps {
	allRegions: Region[];
	allDisabilities: Disability[];
}

export type CaseFormValues = z.infer<typeof CombinedCaseFormSchema>;
