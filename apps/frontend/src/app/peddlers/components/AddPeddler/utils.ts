"use client";
import { DisabilitySchema, RegionSchema } from "@shared/common/schemas";
import { getSessionCookieHeader, query } from "@utils";
import { z } from "zod";

const DisabilitiesSchema = z.array(DisabilitySchema);
const RegionsSchema = z.array(RegionSchema);

export async function fetchDisabilities(abortSignal?: AbortSignal) {
	const { data: allDisabilities, error: fetchDisabilitiesError } = await query({
		path: "/peddler/disability/all",
		validator: DisabilitiesSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal: abortSignal,
		},
	});
	return { allDisabilities, fetchDisabilitiesError };
}

export async function fetchRegions(abortSignal?: AbortSignal) {
	const { data: allRegions, error: fetchRegionsError } = await query({
		path: "/peddler/region/all",
		validator: RegionsSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal: abortSignal,
		},
	});
	return { allRegions, fetchRegionsError };
}
