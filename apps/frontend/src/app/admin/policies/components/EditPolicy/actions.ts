"use server";
import { query, getSessionCookieHeader } from "@utils";
import { StrictPolicySchema } from "@shared/common/schemas";
import type { CreatePolicyInput } from "@shared/common/types";

export async function updatePolicy(id: string, input: CreatePolicyInput) {
	const { status, error, data } = await query({
		path: `/role/policy/${id}`,
		init: {
			method: "PATCH",
			body: JSON.stringify(input),
			headers: await getSessionCookieHeader(),
		},
		validator: StrictPolicySchema,
	});
	return { status, error, data };
}
