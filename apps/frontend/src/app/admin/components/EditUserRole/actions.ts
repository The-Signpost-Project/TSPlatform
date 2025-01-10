"use server";
import { query, getSessionCookieHeader } from "@utils";
import { SafeUserSchema } from "@shared/common/schemas";
import type { UpdateUserInput } from "@shared/common/types";

export async function updateUserRole(id: string, input: Pick<UpdateUserInput, "roles">) {
	const { status, error, data } = await query({
		path: `/user/${id}/role`,
		init: {
			method: "PUT",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: SafeUserSchema,
	});
	return { status, error, data };
}
