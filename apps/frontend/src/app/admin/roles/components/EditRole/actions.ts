"use server";
import { query, getSessionCookieHeader } from "@utils";
import { StrictRoleSchema } from "@shared/common/schemas";
import type { UpdateRoleInput } from "@shared/common/types";

export async function updateRole(id: string, input: UpdateRoleInput) {
	const { status, error, data } = await query({
		path: `/role/${id}`,
		init: {
			method: "PATCH",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: StrictRoleSchema,
	});
	return { status, error, data };
}
