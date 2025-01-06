import { OPERATOR } from "./constants";
import type { StrictPolicy } from "@shared/common/types";

function evaluateCondition(
	// biome-ignore lint/suspicious/noExplicitAny: any is required here
	resourceObj: Record<string, any>,
	field: string,
	operator: (typeof OPERATOR)[keyof typeof OPERATOR],
	value: string | number | boolean | string[] | number[],
): boolean {
	const fieldValue = resourceObj[field];

	switch (operator) {
		case OPERATOR.EQ:
			return fieldValue === value;
		case OPERATOR.NE:
			return fieldValue !== value;
		case OPERATOR.LT:
			return fieldValue < value;
		case OPERATOR.LTE:
			return fieldValue <= value;
		case OPERATOR.GT:
			return fieldValue > value;
		case OPERATOR.GTE:
			return fieldValue >= value;
		case OPERATOR.IN:
			if (!Array.isArray(value)) {
				throw new Error("Value must be an array for 'in' operator");
			}
			return (value as (string | number)[]).includes(fieldValue);
		case OPERATOR.NIN:
			if (!Array.isArray(value)) {
				throw new Error("Value must be an array for 'nin' operator");
			}
			return !(value as (string | number)[]).includes(fieldValue);
		case OPERATOR.CONTAINS:
			if (typeof fieldValue !== "string") {
				throw new Error("Field value must be a string for 'contains' operator");
			}
			return fieldValue.includes(value as string);
		case OPERATOR.STARTS_WITH:
			if (typeof fieldValue !== "string") {
				throw new Error("Field value must be a string for 'starts_with' operator");
			}
			return (fieldValue as string).startsWith(value as string);
		case OPERATOR.ENDS_WITH:
			if (typeof fieldValue !== "string") {
				throw new Error("Field value must be a string for 'ends_with' operator");
			}
			return (fieldValue as string).endsWith(value as string);
		default:
			throw new Error(`Unsupported operator: ${operator}`);
	}
}

// biome-ignore lint/suspicious/noExplicitAny: any is required here
export function hasPermission(resourceObj: Record<string, any>, policy: StrictPolicy): boolean {
	if (policy.conditions.length === 0) {
		return true;
	}

	return policy.conditions.every((condition) => {
		try {
			return evaluateCondition(resourceObj, condition.field, condition.operator, condition.value);
		} catch (error) {
			console.error(error);
			return false;
		}
	});
}
