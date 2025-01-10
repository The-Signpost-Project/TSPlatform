export interface EditUserRoleProps {
	id: string;
	name: string;
	roles: {
		id: string;
		name: string;
		selected: boolean;
	}[];
}
