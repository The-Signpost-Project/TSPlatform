"use client";
import { query } from "@utils";
import { getSessionCookieHeader } from "@utils";
import { StrictCaseSchema } from "@shared/common/schemas";

export async function fetchCase(id: string, signal?: AbortSignal) {
	const { data, error, status } = await query({
		path: `/case/${id}`,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal,
		},
		validator: StrictCaseSchema,
	});
	return { data, error, status };
}
