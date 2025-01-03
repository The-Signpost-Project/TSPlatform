import type { INestApplication } from "@nestjs/common";
import request, { type Test as SuperTestCall, type Response } from "supertest";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type TestFetchInit = {
	init: {
		app: INestApplication;
		method: Method;
		path: string;
		body?: Record<string, unknown>;
		options?: RequestInit;
	};
	callback?: (response: Response) => void;
};

export function testFetch({ callback, init }: TestFetchInit) {
	const { app, method, path, body, options } = init;
	let supertestChainCall: SuperTestCall;
	switch (method) {
		case "GET":
			supertestChainCall = request(app.getHttpServer()).get(path);
			break;
		case "POST":
			supertestChainCall = request(app.getHttpServer()).post(path);
			break;
		case "PUT":
			supertestChainCall = request(app.getHttpServer()).put(path);
			break;
		case "DELETE":
			supertestChainCall = request(app.getHttpServer()).delete(path);
			break;
		default:
			throw new Error("Invalid method");
	}
	supertestChainCall = supertestChainCall
		.set("Accept", "application/json")
		.set("Content-Type", "application/json");

	if (options) {
		const { headers } = options;
		if (headers) {
			Object.entries(headers).forEach(([key, value]) => {
				supertestChainCall = supertestChainCall.set(key, value);
			});
		}
	}

	if (body) {
		supertestChainCall = supertestChainCall.send(body);
	}

	return new Promise((resolve, reject) => {
		supertestChainCall.end((err, res) => {
			if (err) {
				return reject(err);
			}
			if (callback) callback(res);
			resolve(res);
		});
	});
}
