export interface EditRoleProps {
	id: string;
	name: string;
	policies: {
		id: string;
		name: string;
		selected: boolean;
	}[];
}
