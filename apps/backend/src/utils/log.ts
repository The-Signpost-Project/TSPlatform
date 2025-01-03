import logger from "@shared/logger";
import type { Request, Response } from "express";
import type { AppError } from "./appErrors";

type LogType = "info" | "warn" | "error";
type TimeInfo = {
	startTime: number;
	endTime: number;
	duration: number;
};

type LogData = {
	request: Request;
	response?: Response;
	error?: AppError;
	timeInfo?: TimeInfo;
};

export function log(type: LogType, { request, response, error, timeInfo }: LogData): void {
	const requestLog = {
		url: request.url,
		method: request.method,
		headers: request.headers,
		body: request.body,
		query: request.query,
		ips: request.ips,
		hostname: request.hostname,
		protocol: request.protocol,
		secure: request.secure,
	};

	const responseLog = response
		? {
				headers: response.getHeaders(),
				statusCode: response.statusCode,
				statusMessage: response.statusMessage,
			}
		: undefined;

	const errorLog = error
		? {
				code: error.code,
				name: error.name,
				message: error.message,
				stack: error.stack,
			}
		: undefined;

	logger[type]({ requestLog, responseLog, errorLog, timeInfo });
}
