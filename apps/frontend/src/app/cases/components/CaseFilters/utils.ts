import { query } from "@utils";
import { StrictCaseSchema } from "@shared/common/schemas";
import type { CaseFilters } from "@shared/common/types";
import { getSessionCookieHeader } from "@utils";
import { z } from "zod";

const StrictCasesSchema = z.array(StrictCaseSchema);

export async function fetchCases(filters: CaseFilters, signal?: AbortSignal) {
	// convert filters to Record<string, string> from Record<string, string | number>
	const filtersString = Object.fromEntries(
		Object.entries(filters).map(([key, value]) => {
			if (typeof value === "number") {
				return [key, value.toString()];
			}
			if (Array.isArray(value)) {
				return [key, value.map((v) => v.toString())];
			}

			return [key, value];
		}),
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

export const casesPerPage = 10;
export function calculateLimitOffset(page: number) {
	return {
		limit: casesPerPage,
		offset: (page - 1) * casesPerPage,
	};
}
