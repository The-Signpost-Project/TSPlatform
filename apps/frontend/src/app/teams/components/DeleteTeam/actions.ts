"use server";
import { query, getSessionCookieHeader } from "@utils";
import { NullSchema } from "@shared/common/schemas";

export async function deleteTeam(id: string) {
	const { status, error, data } = await query({
		path: `/user/team/${id}`,
		init: {
			method: "DELETE",
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error, data };
}
