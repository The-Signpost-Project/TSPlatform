import type { Prettify } from "./utils";
export interface StrictCondition {
	id: string;
	field: string;
	operator: Operator;
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
	| "region"
	| "team"
	| "allUsers";

export type Action = "read" | "readWrite";

export type Operator =
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

// biome-ignore lint/suspicious/noExplicitAny: shape of resource object is not known
export type ResourceObject = Record<string, any>;

export interface StrictPolicy {
	id: string;
	name: string;
	action: Action;
	resource: Resource;
	conditions: StrictCondition[]; // if empty, then allow all
}

export interface StrictRole {
	id: string;
	name: string;
	policies: StrictPolicy[];
}

export type CreatePolicyInput = Prettify<
	Omit<StrictPolicy, "id" | "conditions"> & {
		conditions: Omit<StrictCondition, "id" | "policyId">[];
	}
>;

export type UpdatePolicyInput = Prettify<Partial<CreatePolicyInput>>;

export type CreateRoleInput = Prettify<
	Omit<StrictRole, "id" | "policies"> & { policies: { id: string }[] }
>;

export type UpdateRoleInput = Prettify<Partial<CreateRoleInput>>;
