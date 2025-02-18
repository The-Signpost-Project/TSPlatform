import { expect, it, describe, beforeAll, afterEach, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { RoleService } from "./role.service";
import type { CreateRoleInput, UpdateRoleInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";

describe("RoleService", () => {
	let service: RoleService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [RoleService, PrismaService],
		}).compile();
		service = module.get<RoleService>(RoleService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create a role", async () => {
			const input: CreateRoleInput = {
				name: faker.company.name(),

				policies: [{ id: faker.string.uuid() }],
			};

			// @ts-expect-error
			prisma.role.create = mock(() => Promise.resolve({ id: faker.string.uuid(), ...input }));
			// @ts-expect-error
			prisma.policyRole.createMany = mock(() => Promise.resolve({}));

			// @ts-expect-error
			prisma.role.findUnique = mock(() => ({ id: faker.string.uuid(), ...input }));

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(result.name).toBe(input.name);
			expect(prisma.role.create).toHaveBeenCalled();
			expect(prisma.policyRole.createMany).toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should return all roles", async () => {
			// @ts-expect-error
			prisma.role.findMany = mock(() =>
				Promise.resolve([
					{
						id: faker.string.uuid(),
						name: faker.company.name(),
						description: faker.lorem.sentence(),
						policies: [],
					},
				]),
			);
			const roles = await service.getAll();
			expect(roles).toBeDefined();
			expect(roles.length).toBeGreaterThan(0);
			expect(prisma.role.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return a role by id", async () => {
			const roleId = faker.string.uuid();
			// @ts-expect-error
			prisma.role.findUnique = mock(() =>
				Promise.resolve({
					id: roleId,
					name: faker.company.name(),
					description: faker.lorem.sentence(),
					policies: [],
				}),
			);
			const role = await service.getById(roleId);
			expect(role).toBeDefined();
			expect(role.id).toBe(roleId);
			expect(prisma.role.findUnique).toHaveBeenCalled();
		});

		it("should throw not found error if role does not exist", async () => {
			const roleId = faker.string.uuid();
			// @ts-expect-error
			prisma.role.findUnique = mock(() => Promise.resolve(null));
			expect(service.getById(roleId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.role.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update a role by id", async () => {
			const roleId = faker.string.uuid();
			const input: UpdateRoleInput = {
				name: faker.company.name(),
				policies: [{ id: faker.string.uuid() }],
			};

			// @ts-expect-error
			prisma.role.update = mock(() => Promise.resolve({ id: roleId, ...input }));
			// @ts-expect-error
			prisma.policyRole.deleteMany = mock(() => Promise.resolve({}));
			// @ts-expect-error
			prisma.policyRole.createMany = mock(() => Promise.resolve({}));

			// @ts-expect-error
			prisma.role.findUnique = mock(() => ({ id: roleId, ...input }));

			const result = await service.updateById(roleId, input);
			expect(result).toBeDefined();
			expect(result.id).toBe(roleId);
			expect(prisma.role.update).toHaveBeenCalled();
			expect(prisma.policyRole.deleteMany).toHaveBeenCalled();
			expect(prisma.policyRole.createMany).toHaveBeenCalled();
		});

		it("should throw not found error if role does not exist", async () => {
			const roleId = faker.string.uuid();
			const input: UpdateRoleInput = {
				name: faker.company.name(),
				policies: [{ id: faker.string.uuid() }],
			};

			prisma.role.update = mock(() => {
				throw new AppError(AppErrorTypes.NotFound);
			});

			expect(service.updateById(roleId, input)).rejects.toThrow(
				new AppError(AppErrorTypes.NotFound),
			);
			expect(prisma.role.update).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete a role by id", async () => {
			const roleId = faker.string.uuid();
			// @ts-expect-error
			prisma.role.delete = mock(() => Promise.resolve({ id: roleId }));
			await service.deleteById(roleId);
			expect(prisma.role.delete).toHaveBeenCalled();
		});
	});
});
