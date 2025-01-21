import type { CaseFilters, StrictCase } from "@shared/common/types";
export interface CaseGridProps {
	data: Promise<{ data: StrictCase[]; error: any; status: any }>;
}
