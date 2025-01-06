import type { Request } from "express";

export type RequestSource = "params" | "query" | "body" | "headers";

export class CheckRequestGuard {
	protected getValueFromRequest(
		request: Request,
		source: RequestSource,
		key: string,
	): string | null {
		switch (source) {
			case "params":
				return request.params[key];
			case "query":
				if (typeof request.query[key] === "string") {
					return request.query[key];
				}
				return null;
			case "body":
				return request.body[key];
			case "headers":
				if (typeof request.headers[key] === "string") {
					return request.headers[key];
				}
				return null;
			default:
				return null;
		}
	}
}
