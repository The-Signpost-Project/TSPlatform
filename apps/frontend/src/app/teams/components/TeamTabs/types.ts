import type { Team, SafeUser } from "@shared/common/types";

// component is controlled by parent
export interface TeamTabsProps {
	teams: Team[];
	allUsers: SafeUser[];
}

export interface TeamContentProps {
	team: Team;
	allUsers: SafeUser[];
}

export interface TeamInfoProps {
	team: Team;
}
