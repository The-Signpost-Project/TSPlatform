import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	createParamDecorator,
} from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import { handleDatabaseError } from "@utils/prismaErrors";
import type { StrictPolicy, StrictRole } from "@shared/common/types";

@Injectable()
export class RoleInterceptor implements NestInterceptor {
	constructor(
		private readonly luciaService: LuciaService,
		private readonly prismaService: PrismaService,
	) {}

	private async getUserRoles(userId: string): Promise<StrictRole[]> {
		try {
			const roles = await this.prismaService.userRole.findMany({
				where: { userId },
				select: {
					// select table Role
					role: {
						include: {
							// navigate join table RolePolicy
							policies: {
								include: {
									// select table Policy and all the conditions in it
									policy: {
										include: {
											conditions: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!roles) {
				return [];
			}
			// all the roles the user has

			return roles.map((r) => ({
				...r.role,
				policies: r.role.policies.map((p) => ({
					...p.policy,
					conditions: p.policy.conditions,
				})) as StrictPolicy[],
			}));
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const tokenId = request.cookies[sessionCookieName] as string | undefined;

		if (!tokenId) {
			request.roles = [];
			return next.handle();
		}

		const { user } = await this.luciaService.validateSessionToken(tokenId);

		if (!user) {
			request.roles = [];
			return next.handle();
		}

		// Attach user attributes to the request object
		request.roles = await this.getUserRoles(user.id);

		return next.handle();
	}
}

export const Roles = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.roles as StrictRole[];
});
