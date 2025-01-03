"use server";

import { cookies } from "next/headers";
import { query } from "@utils";
import { sessionCookieName } from "@shared/common/constants";
import { NullSchema } from "@shared/common/schemas";

export async function signOut() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(sessionCookieName)?.value;

	const { status } = await query({
		path: `/auth/signout/${sessionCookie}`,
		init: {
			method: "DELETE",
		},
		validator: NullSchema,
	});
	return {
		status,
	};
}
