"use server";
import "server-only";
import { cookies } from "next/headers";
import { sessionCookieName } from "@shared/common/constants";

export async function getSessionCookieHeader() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(sessionCookieName)?.value;

	return {
		Cookie: `${sessionCookieName}=${sessionCookie}`,
	};
}
