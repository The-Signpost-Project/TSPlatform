import { Injectable, CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { Request } from "express";
import { LuciaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { type RequestSource, CheckRequestGuard } from "@base";

/**
 * This function creates a guard that checks if the user is authenticated.
 * Used to protect self-serve routes, ie. routes that users access to modify their own data.
 */
export const SelfServeGuard = (source: RequestSource, key: string) => {
	@Injectable()
	class SelfServeGuardMixin extends CheckRequestGuard implements CanActivate {
		constructor(private readonly luciaService: LuciaService) {
			super();
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
