import type { StrictRole } from "@shared/common/types";

export type RoleTableProps = {
	roles: StrictRole[];
	allPolicies: {
		id: string;
		name: string;
	}[];
};
