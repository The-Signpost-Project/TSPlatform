import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
import type { StrictPolicy, CreatePolicyInput, UpdatePolicyInput } from "@shared/common/types";
import { CrudService } from "@base";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Injectable()
export class PolicyService extends CrudService<StrictPolicy> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async create(data: CreatePolicyInput) {
		try {
			const { conditions, ...policyData } = data;
			const policy = await this.prisma.policy.create({ data: policyData });

			const policyConditions = conditions.map((c) => ({
				...c,
				policyId: policy.id,
				value: JSON.stringify(c.value),
			}));

			await this.prisma.condition.createMany({ data: policyConditions });
			return { ...policy, conditions: policyConditions } as StrictPolicy;
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			const policies = await this.prisma.policy.findMany({
				include: { conditions: true },
			});
			return policies as StrictPolicy[];
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const policy = await this.prisma.policy.findUnique({
				where: { id },
				include: { conditions: true },
			});
			if (!policy) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return policy as StrictPolicy;
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdatePolicyInput) {
		try {
			const { conditions, ...policyData } = data;
			const policy = await this.prisma.policy.update({ where: { id }, data: policyData });
			if (conditions === undefined) {
				return this.getById(id);
			}
			const policyConditions = conditions.map((c) => ({
				...c,
				policyId: policy.id,
				value: JSON.stringify(c.value),
			}));
			await this.prisma.condition.deleteMany({ where: { policyId: policy.id } });
			await this.prisma.condition.createMany({ data: policyConditions });
			return this.getById(id);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			await this.prisma.policy.delete({ where: { id } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
