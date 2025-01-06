import { getUser } from "@lib/actions";
import { NextResponse, type NextRequest } from "next/server";
import { protectedPages, hasPermission, MUST_LOGIN } from "@shared/common/abac";

export async function middleware(request: NextRequest) {
	if (!Object.keys(protectedPages).includes(request.nextUrl.pathname)) {
		return NextResponse.next();
	}
	const { data } = await getUser();

	// if the page is protected and the user is not logged in, redirect to the login page
	if (data === null) {
		return NextResponse.redirect(new URL("/error/unauthorised", request.url));
	}

	const availablePolicies = data.roles.flatMap((role) => role.policies);
	// read access is the minimum access level required to access a page
	const requiredResource = protectedPages[request.nextUrl.pathname as keyof typeof protectedPages];

	// if the required resource is MUST_LOGIN, then the user must be logged in, and no further checks are required
	if (requiredResource === MUST_LOGIN) {
		return NextResponse.next();
	}

	// check if the user has the required permission to access the page
	const allowed = availablePolicies.some((policy) =>
		hasPermission(policy, requiredResource, "read"),
	);

	if (allowed) {
		return NextResponse.next();
	}
	return NextResponse.redirect(new URL("/error/forbidden", request.url));
}
