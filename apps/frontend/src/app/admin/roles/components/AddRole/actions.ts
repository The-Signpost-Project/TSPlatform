"use server";
import { query, getSessionCookieHeader } from "@utils";
import { StrictRoleSchema } from "@shared/common/schemas";
import type { CreateRoleInput } from "@shared/common/types";

export async function createRole(input: CreateRoleInput) {
	const { status, error, data } = await query({
		path: "/role",
		init: {
			method: "POST",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: StrictRoleSchema,
	});
	return { status, error, data };
}
