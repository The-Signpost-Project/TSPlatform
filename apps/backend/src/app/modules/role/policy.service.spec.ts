import { expect, it, describe, beforeAll, afterEach, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { PolicyService } from "./policy.service";
import type { CreatePolicyInput, UpdatePolicyInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";

describe("PolicyService", () => {
	let service: PolicyService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [PolicyService, PrismaService],
		}).compile();
		service = module.get<PolicyService>(PolicyService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create a policy", async () => {
			const input: CreatePolicyInput = {
				name: faker.lorem.word(),
				action: "read",
				resource: "role",
				conditions: [
					{
						field: "status",
						operator: "eq",
						value: "active",
					},
				],
			};

			const createdPolicy = { id: faker.string.uuid(), ...input };
			// @ts-expect-error
			prisma.policy.create = mock(() => Promise.resolve(createdPolicy));
			// @ts-expect-error
			prisma.condition.createMany = mock(() => Promise.resolve({}));
			// @ts-expect-error
			prisma.condition.findMany = mock(() => Promise.resolve(createdPolicy.conditions));

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(result.id).toBe(createdPolicy.id);
			expect(prisma.policy.create).toHaveBeenCalled();
			expect(prisma.condition.createMany).toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should return all policies with evaluated conditions", async () => {
			const dbPolicies = [
				{
					id: faker.string.uuid(),
					name: faker.lorem.word(),
					action: "readWrite",
					resource: "policy",
					conditions: [
						{
							id: faker.string.uuid(),
							field: "flag",
							operator: "eq",
							value: "true",
							policyId: faker.string.uuid(),
						},
					],
				},
			];
			// @ts-expect-error
			prisma.policy.findMany = mock(() => Promise.resolve(dbPolicies));

			const results = await service.getAll();
			expect(results).toBeDefined();
			expect(results.length).toBeGreaterThan(0);
			// Check that condition value was evaluated (boolean)
			expect(typeof results[0].conditions[0].value).toBe("boolean");
			expect(prisma.policy.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return a policy by id", async () => {
			const policyId = faker.string.uuid();
			const dbPolicy = {
				id: policyId,
				name: faker.lorem.word(),
				action: "read",
				resource: "peddler",
				conditions: [
					{ id: faker.string.uuid(), field: "role", operator: "eq", value: "admin", policyId },
				],
			};
			// @ts-expect-error
			prisma.policy.findUnique = mock(() => Promise.resolve(dbPolicy));

			const result = await service.getById(policyId);
			expect(result).toBeDefined();
			expect(result.id).toBe(policyId);
			expect(prisma.policy.findUnique).toHaveBeenCalled();
		});

		it("should throw not found error if policy does not exist", async () => {
			const policyId = faker.string.uuid();
			// @ts-expect-error
			prisma.policy.findUnique = mock(() => Promise.resolve(null));

			expect(service.getById(policyId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.policy.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update a policy by id", async () => {
			const policyId = faker.string.uuid();
			const input: UpdatePolicyInput = {
				name: faker.lorem.word(),
				conditions: [{ field: "priority", operator: "gt", value: "5" }],
			};
			const updatedPolicy = {
				id: policyId,
				...input,
				action: "read",
				resource: "policy",
				conditions: [],
			};
			// @ts-expect-error
			prisma.policy.update = mock(() => Promise.resolve(updatedPolicy));
			// @ts-expect-error
			prisma.condition.deleteMany = mock(() => Promise.resolve({}));
			// @ts-expect-error
			prisma.condition.createMany = mock(() => Promise.resolve({}));
			// @ts-expect-error
			prisma.policy.findUnique = mock(() =>
				Promise.resolve({
					...updatedPolicy,
					conditions: input.conditions?.map((c) => ({ id: faker.string.uuid(), ...c, policyId })),
				}),
			);

			const result = await service.updateById(policyId, input);
			expect(result).toBeDefined();
			expect(result.id).toBe(policyId);
			expect(prisma.policy.update).toHaveBeenCalled();
			expect(prisma.condition.deleteMany).toHaveBeenCalled();
			expect(prisma.condition.createMany).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete a policy by id", async () => {
			const policyId = faker.string.uuid();
			// @ts-expect-error
			prisma.policy.delete = mock(() => Promise.resolve({ id: policyId }));
			await service.deleteById(policyId);
			expect(prisma.policy.delete).toHaveBeenCalled();
		});
	});
});
