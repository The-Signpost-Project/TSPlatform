import { Injectable, CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { Request } from "express";
import { LuciaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";

type RequestSource = "params" | "query" | "body" | "headers";

export const AuthGuard = (source: RequestSource, key: string) => {
	@Injectable()
	class AuthGuardMixin implements CanActivate {
		constructor(private readonly luciaService: LuciaService) {}

		async canActivate(context: ExecutionContext): Promise<true> {
			const request = context.switchToHttp().getRequest<Request>();
			const tokenId = request.cookies[sessionCookieName] as string | undefined;
			const userId = this.getUserIdFromRequest(request, source, key);

			if (!tokenId) {
				throw new AppError(AppErrorTypes.Unauthorized);
			}

			if (!userId) {
				throw new AppError(AppErrorTypes.UserNotFound);
			}

			const { user } = await this.luciaService.validateSessionToken(tokenId);

			if (!user || user.id !== userId) {
				throw new AppError(AppErrorTypes.Unauthorized);
			}

			return true;
		}

		private getUserIdFromRequest(
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
	return mixin(AuthGuardMixin);
};
