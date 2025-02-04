"use server";
import { query, getSessionCookieHeader } from "@utils";
import { RegionSchema } from "@shared/common/schemas";

export async function deleteRegion(id: string) {
	const { status, error, data } = await query({
		path: `/peddler/region/${id}`,
		init: {
			method: "DELETE",
			headers: await getSessionCookieHeader(),
		},
		validator: RegionSchema,
	});
	return { status, error, data };
}
