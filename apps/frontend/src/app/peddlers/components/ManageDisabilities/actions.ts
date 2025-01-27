"use server";
import { query, getSessionCookieHeader } from "@utils";
import {
	DisabilitySchema,
	CreateDisabilityInputSchema,
	UpdateDisabilityInputSchema,
	NullSchema,
} from "@shared/common/schemas";
import { z } from "zod";
import type { CreateDisabilityInput, UpdateDisabilityInput } from "@shared/common/types";

const DisabilitiesSchema = z.array(DisabilitySchema);

export async function getDisabilities() {
	const { data, error } = await query({
		path: "/peddler/disability/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: DisabilitiesSchema,
	});
	return { data, error };
}

export async function createDisability(input: CreateDisabilityInput) {
	const { data, error } = await query({
		path: "/peddler/disability",
		init: {
			method: "POST",
			headers: await getSessionCookieHeader(),
			body: JSON.stringify(input),
		},
		validator: DisabilitySchema,
	});
	console.log(data, error);
	return { data, error };
}

export async function updateDisability(id: string, input: UpdateDisabilityInput) {
	const { data, error } = await query({
		path: `/peddler/disability/${id}`,
		init: {
			method: "PATCH",
			headers: await getSessionCookieHeader(),
			body: JSON.stringify(input),
		},
		validator: DisabilitySchema,
	});
	return { data, error };
}

export async function deleteDisability(id: string) {
	const { data, error } = await query({
		path: `/peddler/disability/${id}`,
		init: {
			method: "DELETE",
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { data, error };
}
