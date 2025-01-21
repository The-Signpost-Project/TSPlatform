import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { LuciaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";

/**
 * This function creates a guard that checks if the user is logged in.
 */
@Injectable()
export class LoggedInGuard implements CanActivate {
	constructor(private readonly luciaService: LuciaService) {}

	async canActivate(context: ExecutionContext): Promise<true> {
		const request = context.switchToHttp().getRequest<Request>();
		const tokenId = request.cookies[sessionCookieName] as string | undefined;

		if (!tokenId) {
			throw new AppError(AppErrorTypes.Unauthorized);
		}

		const { user } = await this.luciaService.validateSessionToken(tokenId);

		if (!user) {
			throw new AppError(AppErrorTypes.Unauthorized);
		}

		return true;
	}
}
