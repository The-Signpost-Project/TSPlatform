import type { StrictCase } from "@shared/common/types";

export interface EditCaseProps {
	initialCase: StrictCase;
	revalidate: () => void;
}
