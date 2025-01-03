import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
	protected async throwThrottlingException(
		_context: ExecutionContext,
		throttlerLimitDetail: ThrottlerLimitDetail,
	): Promise<void> {
		const { limit, ttl, timeToBlockExpire } = throttlerLimitDetail;
		// ttl in milliseconds, timeToBlockExpire in seconds
		throw new AppError(AppErrorTypes.RateLimitExceeded(limit, ttl / 1000, timeToBlockExpire));
	}
}
