import type { Prettify } from "./utils";
export interface StrictCondition {
	id: string;
	field: string;
	operator:
		| "eq"
		| "ne"
		| "lt"
		| "lte"
		| "gt"
		| "gte"
		| "in"
		| "nin"
		| "contains"
		| "startsWith"
		| "endsWith";
	value: string | number | boolean | string[] | number[];
	policyId: string;
}

export type Resource =
	| "peddler"
	| "disability"
	| "role"
	| "policy"
	| "case"
	| "peddlerMergeRequest"
	| "user"
	| "region"
	| "team";

export interface StrictPolicy {
	id: string;
	name: string;
	action: "read" | "write";
	resource: Resource;
	conditions: StrictCondition[]; // if empty, then allow all
}

export type CreatePolicyInput = Prettify<
	Omit<StrictPolicy, "id" | "conditions"> & {
		conditions: Omit<StrictCondition, "id" | "policyId">[];
	}
>;

export type UpdatePolicyInput = Prettify<Partial<CreatePolicyInput>>;

export interface StrictRole {
	id: string;
	name: string;
	policies: StrictPolicy[];
}

export type CreateRoleInput = Prettify<
	Omit<StrictRole, "id" | "policies"> & { policies: StrictPolicy[] }
>;

export type UpdateRoleInput = Prettify<Partial<CreateRoleInput>>;
