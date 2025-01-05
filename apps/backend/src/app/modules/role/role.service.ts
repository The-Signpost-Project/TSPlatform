import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
import type { StrictRole, CreateRoleInput, UpdateRoleInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CrudService } from "@base";
import type { Prisma } from "@prisma/client";

@Injectable()
export class RoleService extends CrudService<StrictRole> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	private cleanRoleData(
		data: Prisma.RoleGetPayload<{
			include: {
				policies: {
					include: {
						policy: {
							include: { conditions: true; id: true; name: true; action: true; resource: true };
						};
					};
				};
			};
		}>,
	): StrictRole {
		return {
			...(data as Omit<StrictRole, "policies">),
			policies: data.policies.map((d) => ({ ...(d.policy as StrictRole["policies"][0]) })),
		};
	}

	async create(data: CreateRoleInput) {
		try {
			const { policies, ...roleData } = data;
			const newRole = await this.prisma.role.create({
				data: roleData,
			});

			const policyRoles = policies.map((p) => ({
				roleId: newRole.id,
				policyId: p.id,
			}));

			await this.prisma.policyRole.createMany({ data: policyRoles });

			return this.getById(newRole.id);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			const res = await this.prisma.role.findMany({
				include: {
					policies: {
						include: {
							policy: {
								include: { conditions: true },
							},
						},
					},
				},
			});
			return res.map(this.cleanRoleData);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const role = await this.prisma.role.findUnique({
				where: { id },
				include: {
					policies: {
						include: {
							policy: {
								include: { conditions: true },
							},
						},
					},
				},
			});
			if (!role) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return this.cleanRoleData(role);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdateRoleInput) {
		try {
			const { policies, ...roleData } = data;
			const role = await this.prisma.role.update({ where: { id }, data: roleData });
			if (policies === undefined) {
				return this.getById(id);
			}
			const policyRoles = policies.map((p) => ({
				roleId: role.id,
				policyId: p.id,
			}));
			await this.prisma.policyRole.deleteMany({ where: { roleId: role.id } });
			await this.prisma.policyRole.createMany({ data: policyRoles });
			return this.getById(id);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			await this.prisma.role.delete({ where: { id } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
