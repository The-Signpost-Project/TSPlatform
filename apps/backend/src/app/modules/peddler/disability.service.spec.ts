import { expect, it, describe, beforeAll, afterEach, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { DisabilityService } from "./disability.service";
import type { CreateDisabilityInput, UpdateDisabilityInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";

describe("DisabilityService", () => {
	let service: DisabilityService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [DisabilityService, PrismaService],
		}).compile();
		service = module.get<DisabilityService>(DisabilityService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create a disability", async () => {
			const input: CreateDisabilityInput = { name: faker.lorem.word() };
			const createdDisability = { id: faker.string.uuid(), ...input };

			// @ts-ignore
			prisma.disability.create = mock(() => Promise.resolve(createdDisability));

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(result.name).toBe(input.name);
			expect(prisma.disability.create).toHaveBeenCalled();
		});

		it("should throw an error for empty name", async () => {
			const input = { name: "" } as CreateDisabilityInput;
			expect(service.create(input)).rejects.toThrow();
		});
	});

	describe("getAll", () => {
		it("should return all disabilities", async () => {
			const dbDisabilities = [
				{ id: faker.string.uuid(), name: faker.lorem.word() },
				{ id: faker.string.uuid(), name: faker.lorem.word() },
			];
			// @ts-ignore
			prisma.disability.findMany = mock(() => Promise.resolve(dbDisabilities));

			const result = await service.getAll();
			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);
			expect(prisma.disability.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return a disability by id", async () => {
			const disabilityId = faker.string.uuid();
			const dbDisability = { id: disabilityId, name: faker.lorem.word() };

			// @ts-ignore
			prisma.disability.findUnique = mock(() => Promise.resolve(dbDisability));

			const result = await service.getById(disabilityId);
			expect(result).toBeDefined();
			expect(result.id).toBe(disabilityId);
			expect(prisma.disability.findUnique).toHaveBeenCalled();
		});

		it("should throw not found error if disability does not exist", async () => {
			const disabilityId = faker.string.uuid();
			// @ts-ignore
			prisma.disability.findUnique = mock(() => Promise.resolve(null));

			expect(service.getById(disabilityId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.disability.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update a disability by id", async () => {
			const disabilityId = faker.string.uuid();
			const input: UpdateDisabilityInput = { name: faker.lorem.word() };
			const updatedDisability = { id: disabilityId, ...input };

			// @ts-ignore
			prisma.disability.update = mock(() => Promise.resolve(updatedDisability));
			const result = await service.updateById(disabilityId, input);
			expect(result).toBeDefined();
			expect(result.id).toBe(disabilityId);
			expect(result.name).toBe(input.name as string);
			expect(prisma.disability.update).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete a disability by id", async () => {
			const disabilityId = faker.string.uuid();
			// @ts-ignore
			prisma.disability.delete = mock(() => Promise.resolve({ id: disabilityId }));
			await service.deleteById(disabilityId);
			expect(prisma.disability.delete).toHaveBeenCalled();
		});
	});
});
