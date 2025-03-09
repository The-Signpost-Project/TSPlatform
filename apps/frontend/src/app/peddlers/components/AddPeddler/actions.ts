"use server";
import { query, getSessionCookieHeader } from "@utils";
import { PeddlerSchema } from "@shared/common/schemas";
import type { CreatePeddlerInput } from "@shared/common/types";

export async function createPeddler(newPeddler: CreatePeddlerInput) {
	const { status, error, data } = await query({
		path: "/peddler",
		init: {
			method: "POST",
			body: JSON.stringify({
				...newPeddler,
				firstName: newPeddler.firstName === "" ? null : newPeddler.firstName,
				remarks: newPeddler.remarks === "" ? null : newPeddler.remarks,
			} satisfies CreatePeddlerInput),
			headers: await getSessionCookieHeader(),
		},
		validator: PeddlerSchema,
	});
	return { status, error, data };
}
