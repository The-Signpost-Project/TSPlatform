import { hasPermission } from "@shared/common/abac";
import type { Action, Resource, StrictRole } from "@shared/common/types";

export function rolesHavePermission(
	roles: StrictRole[],
	resource: Resource,
	action: Action,
	// biome-ignore lint/suspicious/noExplicitAny: any is required here
	resourceObj?: Record<string, any>,
) {
	return roles.some((role) =>
		role.policies.some((policy) => hasPermission(policy, resource, action, resourceObj)),
	);
}
