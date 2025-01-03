import { getUser } from "@lib/actions";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/settings"];

export async function middleware(request: NextRequest) {
	if (!protectedRoutes.includes(request.nextUrl.pathname)) {
		return NextResponse.next();
	}
	const { data } = await getUser();

	if (!data) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}
}
