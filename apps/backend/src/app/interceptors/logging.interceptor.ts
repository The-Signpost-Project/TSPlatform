import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request, Response } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { log } from "@/utils/log";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private constructTimeInfo(startTime: number) {
		return {
			startTime,
			endTime: Date.now(),
			duration: Date.now() - startTime,
		};
	}
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				log("info", { request, response, timeInfo: this.constructTimeInfo(now) });
			}),
			catchError((error) => {
				log("error", { request, response, error, timeInfo: this.constructTimeInfo(now) });

				// Re-throw the error so that the filter processes it
				return throwError(() => error);
			}),
		);
	}
}
