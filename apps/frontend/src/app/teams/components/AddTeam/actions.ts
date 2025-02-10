"use server";
import { query, getSessionCookieHeader } from "@utils";
import { TeamSchema } from "@shared/common/schemas";

export async function createTeam(input: FormData) {
	const { status, error, data } = await query({
		path: "/user/team",
		init: {
			method: "POST",
			body: input,
			headers: await getSessionCookieHeader(),
		},
		validator: TeamSchema,
		withFiles: true,
	});
	return { status, error, data };
}
