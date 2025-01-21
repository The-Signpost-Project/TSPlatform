import { query } from "@utils";
import { StrictCaseSchema } from "@shared/common/schemas";
import type { CaseFilters } from "@shared/common/types";
import { getSessionCookieHeader } from "@utils";
import { z } from "zod";

const StrictCasesSchema = z.array(StrictCaseSchema);

export async function fetchCases(filters: CaseFilters, signal?: AbortSignal) {
	// convert filters to Record<string, string> from Record<string, string | number>
	const filtersString = Object.fromEntries(
		Object.entries(filters).map(([key, value]) => [key, value.toString()]),
	);
	console.log(`/case/filter?${new URLSearchParams(filtersString).toString()}`);
	const { data, error, status } = await query({
		path: `/case/filter?${new URLSearchParams(filtersString).toString()}`,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal,
		},
		validator: StrictCasesSchema,
	});
	console.log(data);
	return { data: data ?? [], error, status };
}
