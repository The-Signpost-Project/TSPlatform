"use server";
import { query } from "@utils";
import { NullSchema } from "@shared/common/schemas";
import type { ChangePasswordInput } from "@shared/common/types";
import { getSessionCookieHeader } from "@utils";
import { cookies } from "next/headers";
import { sessionCookieName } from "@shared/common/constants";

export async function changePassword(id: string, input: ChangePasswordInput) {
	const { status, error } = await query({
		path: `/auth/change-password/${id}`,
		init: {
			method: "POST",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error };
}

export async function sendVerifyEmail(id: string) {
	const { status, error } = await query({
		path: "/email/verify",
		init: {
			method: "POST",
			body: JSON.stringify({ id }),
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error };
}

export async function deleteAccount(id: string) {
	const { status, error } = await query({
		path: `/user/${id}`,
		init: {
			method: "DELETE",
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	// delete the session cookie
	(await cookies()).delete(sessionCookieName);

	return { status, error };
}
