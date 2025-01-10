import type { SafeUser } from "@shared/common/types";
export type UserTableProps = {
	users: SafeUser[];
	allRoles: {
		id: string;
		name: string;
	}[];
};
