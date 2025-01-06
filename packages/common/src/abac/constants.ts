import type { StrictCondition, StrictPolicy, Resource } from "@shared/common/types";

export const OPERATOR = {
	EQ: "eq",
	NE: "ne",
	LT: "lt",
	LTE: "lte",
	GT: "gt",
	GTE: "gte",
	IN: "in",
	NIN: "nin",
	CONTAINS: "contains",
	STARTS_WITH: "startsWith",
	ENDS_WITH: "endsWith",
} as const satisfies Record<string, StrictCondition["operator"]>;

export const RESOURCES = {
	PEDDLER: "peddler",
	DISABILITY: "disability",
	ROLE: "role",
	POLICY: "policy",
	CASE: "case",
	PEDDLER_MERGE_REQUEST: "peddlerMergeRequest",
	ALL_USERS: "allUsers",
	REGION: "region",
	TEAM: "team",
} as const satisfies Record<string, Resource>;

export const ACTION = {
	READ: "read",
	READ_WRITE: "readWrite",
} as const satisfies Record<string, StrictPolicy["action"]>;
