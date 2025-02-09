import { getUser } from "@lib/actions";
import { NextResponse, type NextRequest } from "next/server";
import { protectedPages, hasPermission, MUST_LOGIN } from "@shared/common/abac";
import type { Resource } from "@shared/common/types";

export async function middleware(request: NextRequest) {
	// loop through the protected pages and check if the current page is protected, using a regex to match the URL
	// if the page is protected, get the required resource for the page
	let requiredResource: readonly Resource[] | typeof MUST_LOGIN | undefined;
	for (const [path, resources] of Object.entries(protectedPages)) {
		if (new RegExp(path).test(request.nextUrl.pathname)) {
			requiredResource = resources;
		}
	}

	// if no required resource is found, the page is not protected
	if (requiredResource === undefined) {
		return NextResponse.next();
	}

	// if the page is protected and the user is not logged in, redirect to the login page
	const { data } = await getUser();
	if (data === null) {
		return NextResponse.redirect(new URL("/error/unauthorised", request.url));
	}

	// if the required resource is MUST_LOGIN, then the user must be logged in, and no further checks are required
	if (requiredResource === MUST_LOGIN) {
		return NextResponse.next();
	}

	// check if the user has the required permission to access the page
	const availablePolicies = data.roles.flatMap((role) => role.policies);
	const missingPolicies = requiredResource.filter((resource) =>
		// read access is the minimum access level required to access a protected page
		availablePolicies.every((policy) => !hasPermission(policy, resource, "read")),
	);

	if (missingPolicies.length === 0) {
		return NextResponse.next();
	}
	const missingPoliciesString = new URLSearchParams({ missing: missingPolicies.join(",") });
	return NextResponse.redirect(new URL(`/error/forbidden?${missingPoliciesString}`, request.url));
}
