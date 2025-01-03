import { Catch, type ExceptionFilter, type ArgumentsHost, HttpException } from "@nestjs/common";
import type { Request, Response } from "express";
import { AppError } from "@utils/appErrors";
import { constructResponse } from "@utils/constructResponse";

@Catch(AppError, HttpException)
export class AppErrorFilter implements ExceptionFilter {
	catch(exception: AppError | HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json(
			constructResponse({
				error: {
					path: request.url,
					name: exception.name,
					cause: exception.cause as string,
				},
			}),
		);
	}
}
