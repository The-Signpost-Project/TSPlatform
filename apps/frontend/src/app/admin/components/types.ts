import type { SafeUser, StrictRole } from "@shared/common/types";
export type UserTableProps = {
	users: SafeUser[];
};

export type RoleTableProps = {
	roles: StrictRole[];
};
