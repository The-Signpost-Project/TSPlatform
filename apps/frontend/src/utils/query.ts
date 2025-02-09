import type { Prettify, ErrorResponse } from "@shared/common/types";
import { type ZodType, ZodError, z } from "zod";

export type QueryResult<T> = {
	status: number;
	data: Prettify<T> | null;
	error: Prettify<ErrorResponse> | null;
	headers: Headers;
	timeStamp: string;
};

type QueryParams<T> = {
	path: string;
	init?: RequestInit;
	validator: ZodType<T>;
	withFiles?: boolean;
};

function getBaseValidator<T>(validator: ZodType<T>) {
	return z.object({
		success: z.boolean(),
		timestamp: z.string(),
		data: validator.nullable(),
		error: z
			.object({
				path: z.string(),
				name: z.string(),
				cause: z.string(),
			})
			.nullable(),
	});
}

export async function query<T = void>({
	path,
	init,
	validator,
	withFiles,
}: QueryParams<T>): Promise<Prettify<QueryResult<T>>> {
	// check if we are rendering on the server or the client
	const isSSR = typeof window === "undefined";
	// if on the server, we must communcate with the api container using docker networking
	// if on the client, the docker networking is not available, so we must use the client's host
	const baseURL = isSSR
		? process.env.NEXT_PUBLIC_API_URL_SERVER
		: process.env.NEXT_PUBLIC_API_URL_CLIENT;
	const url = path.startsWith("/") ? baseURL + path : path;

	const contentType = withFiles ? undefined : { "content-type": "application/json" };

	return fetch(url, {
		...init,
		credentials: "include",
		headers: {
			...contentType,
			...init?.headers,
		},
	})
		.then(async (res) => {
			let body: unknown;
			try {
				body = await res.json();
				const schema = getBaseValidator(validator);

				const parsed = schema.parse(body);
				return {
					status: res.status,
					// biome-ignore lint/style/noNonNullAssertion: data is guaranteed to be valid if success is true
					data: parsed.success ? parsed.data! : null,
					error: parsed.success ? null : parsed.error,
					headers: res.headers,
					timeStamp: parsed.timestamp,
				};
			} catch (error) {
				console.warn("Failed fetch call:", JSON.stringify(error));
				if (typeof error === "object" && error instanceof ZodError) {
					console.warn("Validation error. Received:");
					console.dir(body);
				}
				return {
					status: res.status,
					data: null,
					error: { path: url, name: "Failed to parse response", cause: JSON.stringify(error) },
					headers: res.headers,
					timeStamp: new Date().toISOString(),
				};
			}
		})
		.catch((error) => {
			console.warn("Failed fetch call:", JSON.stringify(error), error.message);
			return {
				status: 500,
				data: null,
				error: { path: url, name: "Failed to fetch", cause: JSON.stringify(error) },
				headers: new Headers(),
				timeStamp: new Date().toISOString(),
			};
		});
}
