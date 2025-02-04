"use server";
import { query, getSessionCookieHeader } from "@utils";
import { RegionSchema } from "@shared/common/schemas";

export async function updateRegion(id: string, input: FormData) {
	const { status, error, data } = await query({
		path: `/peddler/region/${id}`,
		init: {
			method: "PATCH",
			body: input,
			headers: await getSessionCookieHeader(),
		},
		validator: RegionSchema,
		withFiles: true,
	});
	return { status, error, data };
}
