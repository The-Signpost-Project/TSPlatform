"use server";
import { z } from "zod";
import { RegionSchema } from "@shared/common/schemas";
import { query, getSessionCookieHeader } from "@utils";

const RegionsSchema = z.array(RegionSchema);

export async function getRegions() {
	const { data, error } = await query({
		path: "/peddler/region/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: RegionsSchema,
	});
	return { data, error };
}
