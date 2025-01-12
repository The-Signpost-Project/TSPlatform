"use server";
import { query, getSessionCookieHeader } from "@utils";
import { RegionSchema } from "@shared/common/schemas";

export async function createRegion(input: FormData) {
	const { status, error, data } = await query({
		path: "/peddler/region",
		init: {
			method: "POST",
			body: input,
			headers: await getSessionCookieHeader(),
		},
		validator: RegionSchema,
		withFiles: true,
	});
	console.log(status, error, data);
	return { status, error, data };
}
