"use server";

import { cookies } from "next/headers";
import { query } from "@utils";
import { sessionCookieName } from "@shared/common/constants";
import { SafeUserSchema } from "@shared/common/schemas";

export async function getUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(sessionCookieName)?.value;

	const { status, data } = await query({
		path: "/user/me",
		init: {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `${sessionCookieName}=${sessionCookie}`,
			},
		},
		validator: SafeUserSchema,
	});

	return {
		status,
		data,
		tokenId: sessionCookie,
	};
}
