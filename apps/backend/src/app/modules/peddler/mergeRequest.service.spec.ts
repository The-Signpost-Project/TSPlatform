import { Test, type TestingModule } from "@nestjs/testing";
import { MergeRequestService } from "./mergeRequest.service";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { expect, describe, it, beforeAll, afterEach, mock } from "bun:test";
import { ConfigService } from "@nestjs/config";

describe("MergeRequestService", () => {
	let service: MergeRequestService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MergeRequestService, PrismaService, ConfigService],
		}).compile();
		service = module.get<MergeRequestService>(MergeRequestService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	describe("create", () => {
		it("should create a merge request", async () => {
			const input = {
				peddlerNewId: faker.string.uuid(),
				peddlerOldId: faker.string.uuid(),
				requestedById: faker.string.uuid(),
				notes: faker.lorem.sentence(),
			};
			const created = { id: faker.string.uuid(), ...input };

			// @ts-ignore
			prisma.peddlerMergeRequest.create = mock(() => Promise.resolve(created));

			const result = await service.create(input);
			// @ts-ignore
			expect(result).toEqual(created);
			expect(prisma.peddlerMergeRequest.create).toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should return all merge requests", async () => {
			const requests = [
				{
					id: faker.string.uuid(),
					peddlerNewId: faker.string.uuid(),
					peddlerOldId: faker.string.uuid(),
					requestedById: faker.string.uuid(),
					notes: faker.lorem.sentence(),
				},
			];
			// @ts-ignore
			prisma.peddlerMergeRequest.findMany = mock(() => Promise.resolve(requests));

			const result = await service.getAll();
			// @ts-ignore
			expect(result).toEqual(requests);
			expect(prisma.peddlerMergeRequest.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return a merge request if found", async () => {
			const id = faker.string.uuid();
			const request = {
				id,
				peddlerNewId: faker.string.uuid(),
				peddlerOldId: faker.string.uuid(),
				requestedById: faker.string.uuid(),
				notes: faker.lorem.sentence(),
			};
			// @ts-ignore
			prisma.peddlerMergeRequest.findUnique = mock(() => Promise.resolve(request));

			const result = await service.getById(id);
			// @ts-ignore
			expect(result).toEqual(request);
			expect(prisma.peddlerMergeRequest.findUnique).toHaveBeenCalled();
		});

		it("should throw NotFound error if merge request not found", async () => {
			const id = faker.string.uuid();
			// @ts-ignore
			prisma.peddlerMergeRequest.findUnique = mock(() => Promise.resolve(null));

			expect(service.getById(id)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.peddlerMergeRequest.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update the merge request", async () => {
			const id = faker.string.uuid();
			const updateData = { notes: faker.lorem.sentence() };
			const updated = {
				id,
				peddlerNewId: faker.string.uuid(),
				peddlerOldId: faker.string.uuid(),
				requestedById: faker.string.uuid(),
				notes: updateData.notes,
			};
			// @ts-ignore
			prisma.peddlerMergeRequest.update = mock(() => Promise.resolve(updated));

			const result = await service.updateById(id, updateData);
			// @ts-ignore
			expect(result).toEqual(updated);
			expect(prisma.peddlerMergeRequest.update).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete the merge request", async () => {
			const id = faker.string.uuid();
			// @ts-ignore
			prisma.peddlerMergeRequest.delete = mock(() => Promise.resolve({ id }));

			await service.deleteById(id);
			expect(prisma.peddlerMergeRequest.delete).toHaveBeenCalled();
		});
	});
});
