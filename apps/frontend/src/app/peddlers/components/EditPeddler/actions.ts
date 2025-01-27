"use server";
import { query, getSessionCookieHeader } from "@utils";
import { PeddlerSchema, RegionSchema } from "@shared/common/schemas";
import type { UpdatePeddlerInput } from "@shared/common/types";
import { z } from "zod";

export async function updatePeddler(id: string, input: UpdatePeddlerInput) {
	const { status, error, data } = await query({
		path: `/peddler/${id}`,
		init: {
			method: "PATCH",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: PeddlerSchema,
	});
	return { status, error, data };
}

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
