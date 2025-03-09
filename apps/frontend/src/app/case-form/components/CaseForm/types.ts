import type { Region, Disability, StrictPeddler } from "@shared/common/types";
import type { CreatePeddlerInput } from "@shared/common/types";

export interface CaseFormProps {
	allRegions: Region[];
	allDisabilities: Disability[];
	allPeddlers: StrictPeddler[];
}

export type CaseFormValues = {
	interactionDate: Date;
	regionId: string;
	location: string;
	notes: string;
	importance: 1 | 2 | 3 | 4 | 5;
} & (
	| ({
			firstInteraction: true;
	  } & Pick<
			CreatePeddlerInput,
			"lastName" | "firstName" | "race" | "sex" | "birthYear" | "disabilityIds" | "remarks"
	  >)
	| {
			firstInteraction: false;
			peddlerId: string;
	  }
);
