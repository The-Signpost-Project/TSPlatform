import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { constructResponse } from "@utils/constructResponse";

@Injectable()
export class StandardInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		const response = httpContext.getResponse<Response>();
		// Skip response transformation for specific HTTP methods like HEAD
		if (request.method === "HEAD" || request.method === "OPTIONS") {
			return next.handle(); // Let it pass through without modifying the response
		}
		return next.handle().pipe(
			map((data) => {
				if (response.headersSent) {
					// If headers are already sent, we shouldn't modify the response
					return data;
				}
				return constructResponse({ data });
			}),
		);
	}
}
