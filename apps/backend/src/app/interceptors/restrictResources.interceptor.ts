import { filterResourceByRoles } from "@utils/rolesHavePermission";
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, mixin } from "@nestjs/common";
import type { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LuciaService, PrismaService } from "@db/client";
import { sessionCookieName } from "@shared/common/constants";
import type { Action, Resource, StrictPolicy, StrictRole } from "@shared/common/types";

export function RestrictResourcesInterceptor(resource: Resource, action: Action) {
	@Injectable()
	class RestrictResourcesInterceptorMixin implements NestInterceptor {
		constructor(
			private readonly luciaService: LuciaService,
			private readonly prismaService: PrismaService,
		) {}

		private evaluateValue(input: string) {
			// Trim input to remove leading and trailing inverted commas
			const value = input.replace(/^"(.*)"$/, "$1");

			// Coerce to boolean
			if (value.toLowerCase() === "true") {
				return true;
			}
			if (value.toLowerCase() === "false") {
				return false;
			}

			// Coerce to number
			const numberVal = Number(value);
			if (!Number.isNaN(numberVal)) {
				return numberVal;
			}

			if (value.startsWith("[") && value.endsWith("]")) {
				try {
					// Remove extra backslashes from escaped strings
					const sanitizedValue = value.replace(/\\/g, "");
					const arrayVal = JSON.parse(sanitizedValue);

					if (Array.isArray(arrayVal)) {
						// Check if it's a number array
						if (arrayVal.every((v) => typeof v === "number" || !Number.isNaN(Number(v)))) {
							return arrayVal.map((v) => (typeof v === "number" ? v : Number(v)));
						}
						// Check if it's a string array
						if (arrayVal.every((v) => typeof v === "string")) {
							return arrayVal;
						}
					}
				} catch (_error) {}
			}

			// Default case: return the string itself
			return value;
		}

		private async getUserRoles(userId: string): Promise<StrictRole[]> {
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
					conditions: p.policy.conditions.map((c) => ({
						...c,
						value: this.evaluateValue(c.value),
					})),
				})) as StrictPolicy[],
			}));
		}

		async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
			const httpContext = context.switchToHttp();
			const request = httpContext.getRequest<Request>();
			const response = httpContext.getResponse<Response>();

			const tokenId = request.cookies[sessionCookieName] as string | undefined;

			if (!tokenId) {
				return next.handle();
			}

			const { user } = await this.luciaService.validateSessionToken(tokenId);

			if (!user) {
				return next.handle();
			}

			const roles = await this.getUserRoles(user.id);

			return next.handle().pipe(
				map((data) => {
					const { result, partial } = filterResourceByRoles(roles, resource, action, data);
					if (partial) {
						// partial content means that some of the resources were filtered out due to permissions restrictions
						response.setHeader("X-Content-Partial", "true");
					} else {
						// no partial content means that all resources were returned
						response.setHeader("X-Content-Partial", "false");
					}
					return result;
				}),
			);
		}
	}
	return mixin(RestrictResourcesInterceptorMixin);
}
