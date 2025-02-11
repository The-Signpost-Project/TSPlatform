import { hasPermission } from "@shared/common/abac";
import type { Action, Resource, ResourceObject, StrictRole } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";

export function rolesHavePermission(
	roles: StrictRole[],
	resource: Resource,
	action: Action,

	resourceObj?: ResourceObject,
) {
	return roles.some((role) =>
		role.policies.some((policy) => hasPermission(policy, resource, action, resourceObj)),
	);
}

interface FilteredResource {
	partial: boolean;
	result: ResourceObject | ResourceObject[];
}

export function filterResourceByRoles(
	roles: StrictRole[],
	resource: Resource,
	action: Action,
	resourceObject: ResourceObject[] | ResourceObject,
): FilteredResource {
	if (Array.isArray(resourceObject)) {
		const filtered = resourceObject.filter((resourceObj) =>
			rolesHavePermission(roles, resource, action, resourceObj),
		) as ResourceObject[];
		return {
			partial: filtered.length !== resourceObject.length,
			result: filtered,
		};
	}

	// is single resource object
	if (rolesHavePermission(roles, resource, action, resourceObject)) {
		return {
			partial: false,
			result: resourceObject,
		};
	}
	throw new AppError(AppErrorTypes.NoPermission);
}
