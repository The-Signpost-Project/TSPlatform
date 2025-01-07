import { OPERATOR } from "./constants";
import type { Action, Resource, StrictPolicy } from "@shared/common/types";

function evaluateCondition(
	// biome-ignore lint/suspicious/noExplicitAny: any is required here
	resourceObj: Record<string, any>,
	field: string,
	operator: (typeof OPERATOR)[keyof typeof OPERATOR],
	value: string | number | boolean | string[] | number[],
): boolean {
	const fieldValue = resourceObj[field];

	if (fieldValue === undefined) {
		return false;
	}

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
			return fieldValue.startsWith(value as string);
		case OPERATOR.ENDS_WITH:
			if (typeof fieldValue !== "string") {
				throw new Error("Field value must be a string for 'ends_with' operator");
			}
			return fieldValue.endsWith(value as string);
		default:
			throw new Error(`Unsupported operator: ${operator}`);
	}
}

function checkAction(policy: StrictPolicy, action: StrictPolicy["action"]): boolean {
	// if the policy action is readWrite, then allow all actions
	if (policy.action === "readWrite") {
		return true;
	}
	// else check if the policy (read) matches the action (read/readwrite)
	return policy.action === action;
}

export function hasPermission(
	policy: StrictPolicy,
	resource: Resource,
	action: Action,
	// biome-ignore lint/suspicious/noExplicitAny: any is required here
	resourceObj?: Record<string, any>,
): boolean {
	// if no conditions are specified, then allow all given resource and action match
	if (policy.conditions.length === 0) {
		return policy.resource === resource && checkAction(policy, action);
	}
	// if conditions are specified, then check if all conditions are met

	// if resource object is not provided, there is no way to evaluate the conditions so deny
	if (!resourceObj) {
		return false;
	}

	// check if the resource and action match and all conditions are met
	return (
		policy.resource === resource &&
		checkAction(policy, action) &&
		policy.conditions.every((condition) => {
			try {
				return evaluateCondition(resourceObj, condition.field, condition.operator, condition.value);
			} catch (error) {
				console.error(error);
				return false;
			}
		})
	);
}
