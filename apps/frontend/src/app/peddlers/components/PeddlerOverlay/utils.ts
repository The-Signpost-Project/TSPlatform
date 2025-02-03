"use client";
import { query } from "@utils";
import { getSessionCookieHeader } from "@utils";
import { PeddlerSchema } from "@shared/common/schemas";

export async function fetchCase(id: string, signal?: AbortSignal) {
	const { data, error, status } = await query({
		path: `/peddler/${id}`,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
			signal,
		},
		validator: PeddlerSchema,
	});
	return { data, error, status };
}

export async function downloadReport(id: string) {
	// use the browser's native fetch API to download the report since we don't need to validate the response
	// fetch on the client side is used
	const reqUrl = `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/report/${id}`;
	const res = await fetch(reqUrl, { headers: await getSessionCookieHeader() });
	if (!res.ok) {
		const body: Record<string, unknown> = await res.json();

		return {
			download: null,
			error: {
				path: reqUrl,
				name: "Failed to download report",
				cause: body.error ?? res.statusText,
			},
		};
	}
	const blob = await res.blob();
	const url = URL.createObjectURL(blob);
	return {
		download() {
			const a = document.createElement("a");
			a.href = url;
			a.download = `report-${id}.docx`;
			a.click();
			URL.revokeObjectURL(url);
		},
		error: null,
	};
}
