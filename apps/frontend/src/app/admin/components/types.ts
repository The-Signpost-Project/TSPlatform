import type { SafeUser, StrictRole, StrictPolicy } from "@shared/common/types";
export type UserTableProps = {
	users: SafeUser[];
};

export type RoleTableProps = {
	roles: StrictRole[];
};

export type PolicyTableProps = {
	policies: StrictPolicy[];
};
