import { Injectable, CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { Request } from "express";
import { LuciaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";

type RequestSource = "params" | "query" | "body" | "headers";
/**
 * This function creates a guard that checks if the user is authenticated.
 * Used to protect self-serve routes, ie. routes that users access to modify their own data.
 */
export const SelfServeGuard = (source: RequestSource, key: string) => {
	@Injectable()
	class SelfServeGuardMixin implements CanActivate {
		constructor(private readonly luciaService: LuciaService) {}
		private getValueFromRequest(
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

		async canActivate(context: ExecutionContext): Promise<true> {
			const request = context.switchToHttp().getRequest<Request>();
			const tokenId = request.cookies[sessionCookieName] as string | undefined;
			const userId = this.getValueFromRequest(request, source, key);

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
	}
	return mixin(SelfServeGuardMixin);
};
