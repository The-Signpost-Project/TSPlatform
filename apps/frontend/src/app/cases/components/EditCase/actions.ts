"use server";
import { z } from "zod";
import { RegionSchema, StrictCaseSchema } from "@shared/common/schemas";
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

export async function updateCase(id: string, fd: FormData) {
	const { status, data, error } = await query({
		path: `/case/${id}`,
		init: {
			method: "PATCH",
			headers: await getSessionCookieHeader(),
			body: fd,
		},
		withFiles: true,
		validator: StrictCaseSchema,
	});
	return { data, error, status };
}
