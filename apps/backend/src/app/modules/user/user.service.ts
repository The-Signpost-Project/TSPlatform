import { Injectable } from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import type {
	OAuthProvider,
	SafeUser,
	StrictPolicy,
	StrictRole,
	UpdateUserInput,
} from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CrudService } from "@base";
import type { Prisma } from "@prisma/client";

@Injectable()
export class UserService extends CrudService<SafeUser> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {
		super();
	}

	private rawUserFindFields = {
		id: true,
		username: true,
		email: true,
		createdAt: true,
		verified: true,
		allowEmailNotifications: true,
		passwordHash: true,
		oauthAccounts: {
			select: {
				providerId: true,
			},
		},
	} as const;

	private cleanUserData(
		data: Prisma.UserGetPayload<{
			include: {
				oauthAccounts: { select: { providerId: true } };
			};
		}>,
	): Omit<SafeUser, "roles"> {
		// find any oAuth providers that the user has connected
		const oAuthProviders = data.oauthAccounts.map(
			(account) => account.providerId,
		) as OAuthProvider[];

		return {
			...data,

			oAuthProviders: oAuthProviders,
			hasPassword: !!data.passwordHash,
		};
	}

	private async getUserRoles(userId: string): Promise<StrictRole[]> {
		try {
			const roles = await this.prisma.userRole.findMany({
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

	async getBySessionId(tokenId: string | undefined): Promise<SafeUser> {
		if (!tokenId) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		const { session, user } = await this.lucia.validateSessionToken(tokenId);

		if (!session || !user) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		return this.getById(user.id);
	}

	async getById(id: string): Promise<SafeUser> {
		const rawUser = await this.prisma.user.findUnique({
			where: { id },
			select: this.rawUserFindFields,
		});
		if (!rawUser) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		const roles = await this.getUserRoles(id);

		return {
			...this.cleanUserData(rawUser),
			roles,
		};
	}

	async updateById(id: string, data: UpdateUserInput): Promise<SafeUser> {
		const { roles, ...userData } = data;
		try {
			await this.prisma.user.update({
				where: { id },
				data: userData,
			});
			if (roles) {
				await this.prisma.userRole.deleteMany({
					where: {
						userId: id,
					},
				});
				await this.prisma.userRole.createMany({
					data: roles.map((role) => ({
						userId: id,
						roleId: role.roleId,
					})),
				});
			}
			return this.getById(id);
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		try {
			await this.prisma.user.delete({
				where: { id },
			});
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}
}
