"use server";
import { query, getSessionCookieHeader } from "@utils";
import { NullSchema } from "@shared/common/schemas";

export async function deletePeddler(id: string) {
	const { status, error, data } = await query({
		path: `/peddler/${id}`,
		init: {
			method: "DELETE",
			headers: await getSessionCookieHeader(),
		},
		validator: NullSchema,
	});
	return { status, error, data };
}
