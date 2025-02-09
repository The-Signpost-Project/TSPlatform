import type { Region, StrictPeddler, Team } from "@shared/common/types";

export interface CaseFiltersProps {
	allRegions: Region[];
	allPeddlers: StrictPeddler[];
	allTeams: Team[];
}
