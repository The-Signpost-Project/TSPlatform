import { RESOURCES } from "./constants";

/**
 * This constant is an additional resource that is not defined in the constants file.
 * It is used to specify that the user must be logged in to access the page.
 */
export const MUST_LOGIN = "mustLogin";

/**
 * This object contains the list of pages that are protected by permissions.
 * The key is the page path and the value is the resource that the page is associated with.
 */
export const protectedPages = {
	"/settings": MUST_LOGIN,
	"/admin": RESOURCES.ALL_USERS,
	"/admin/roles": RESOURCES.ROLE,
	"/admin/policies": RESOURCES.POLICY,
	"/regions": RESOURCES.REGION,
	"/teams": RESOURCES.TEAM,
	"/case-form": MUST_LOGIN,
	"/cases": RESOURCES.CASE,
	"/peddlers": RESOURCES.PEDDLER,
} as const;
