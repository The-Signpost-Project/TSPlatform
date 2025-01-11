import type { StrictCondition } from "@shared/common/types";

export const operatorMapping: Record<StrictCondition["operator"], string> = {
	eq: "equals",
	ne: "does not equal",
	gt: "is greater than",
	lt: "is less than",
	gte: "is greater than or equal to",
	lte: "is less than or equal to",
	in: "is in",
	nin: "is not in",
	contains: "contains",
	startsWith: "starts with",
	endsWith: "ends with",
};
