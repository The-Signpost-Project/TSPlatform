"use server";
import { query, getSessionCookieHeader } from "@utils";
import { NullSchema } from "@shared/common/schemas";

export async function addMemberToTeam(teamId: string, userId: string) {
	const { status, error, data } = await query({
		path: `/user/team/${teamId}/member`,
		init: {
			method: "POST",
			body: JSON.stringify({ userId }),
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error, data };
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
	const { status, error, data } = await query({
		path: `/user/team/${teamId}/member`,
		init: {
			method: "DELETE",
			body: JSON.stringify({ userId }),
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error, data };
}
