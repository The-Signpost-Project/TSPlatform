import type { Team } from "@shared/common/types";

// component is controlled by parent
export interface TeamTabsProps {
	teams: Team[];
}

export interface TeamInfoProps {
	team: Team;
}
