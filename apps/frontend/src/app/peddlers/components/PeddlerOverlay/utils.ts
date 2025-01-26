"use client";
import { query } from "@utils";
import { getSessionCookieHeader } from "@utils";
import { PeddlerSchema } from "@shared/common/schemas";

export async function fetchCase(id: string, signal?: AbortSignal) {
	const { data, error, status } = await query({
		path: `/peddler/${id}`,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal,
		},
		validator: PeddlerSchema,
	});
	return { data, error, status };
}
