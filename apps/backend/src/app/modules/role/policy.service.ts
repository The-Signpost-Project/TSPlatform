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

	evaluateValue(input: string) {
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

	async create(data: CreatePolicyInput) {
		try {
			const { conditions, ...policyData } = data;
			const policy = await this.prisma.policy.create({ data: policyData });

			const policyConditionsToInsert = conditions.map((c) => ({
				...c,
				policyId: policy.id,
				value: JSON.stringify(c.value),
			}));

			await this.prisma.condition.createMany({ data: policyConditionsToInsert });
			const policyConditions = await this.prisma.condition.findMany({
				where: {
					policyId: policy.id,
				},
			});
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
			return policies.map((p) => ({
				...p,
				conditions: p.conditions.map((c) => ({ ...c, value: this.evaluateValue(c.value) })),
			})) as StrictPolicy[];
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
			return {
				...policy,
				conditions: policy.conditions.map((c) => ({ ...c, value: this.evaluateValue(c.value) })),
			} as StrictPolicy;
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
