import { expect, it, describe, beforeAll, afterEach, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { PeddlerService } from "./peddler.service";
import type { CreatePeddlerInput, UpdatePeddlerInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";

describe("PeddlerService", () => {
	let service: PeddlerService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [PeddlerService, PrismaService],
		}).compile();
		service = module.get<PeddlerService>(PeddlerService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create a peddler", async () => {
			const mainRegion = { id: faker.string.uuid(), name: faker.location.city(), photoPath: null };
			const input = {
				lastName: faker.person.lastName(),
				sex: "M",
				mainRegionId: mainRegion.id,
				disabilityIds: [faker.string.uuid()],
				remarks: faker.lorem.sentence(),
			} as CreatePeddlerInput;

			// @ts-ignore
			prisma.region.findUnique = mock(() => Promise.resolve(mainRegion));
			// mock peddler creation
			const createdPeddler = {
				id: faker.string.uuid(),
				codename: `${mainRegion.name}_${input.lastName}_${input.sex}`,
				...input,
			};
			// @ts-ignore
			prisma.peddler.create = mock(() => Promise.resolve(createdPeddler));
			// @ts-ignore
			prisma.peddlerDisability.createMany = mock(() => Promise.resolve({}));
			// @ts-ignore
			prisma.peddler.findUnique = mock(() =>
				Promise.resolve({
					...createdPeddler,
					mainRegion,
					disabilities: [{ id: faker.string.uuid(), disability: { name: "Example" } }],
				}),
			);

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(result.codename).toBe(`${mainRegion.name}_${input.lastName}_${input.sex}`);
			expect(prisma.region.findUnique).toHaveBeenCalled();
			expect(prisma.peddler.create).toHaveBeenCalled();
			expect(prisma.peddlerDisability.createMany).toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should return all peddlers", async () => {
			const dbPeddlers = [
				{
					id: faker.string.uuid(),
					lastName: faker.person.lastName(),
					sex: "F",
					codename: "region_last_F",
					mainRegion: { id: faker.string.uuid(), name: "RegionX" },
					disabilities: [{ id: faker.string.uuid(), disability: { name: "Sample" } }],
				},
			];
			// @ts-ignore
			prisma.peddler.findMany = mock(() => Promise.resolve(dbPeddlers));

			const result = await service.getAll();
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(prisma.peddler.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return a peddler by id", async () => {
			const peddlerId = faker.string.uuid();
			const dbPeddler = {
				id: peddlerId,
				lastName: faker.person.lastName(),
				sex: "M",
				codename: "RegionY_Last_M",
				mainRegion: { id: faker.string.uuid(), name: "RegionY" },
				remarks: faker.lorem.sentence(),
				disabilities: [{ id: faker.string.uuid(), disability: { name: "TestDisability" } }],
			};
			// @ts-ignore
			prisma.peddler.findUnique = mock(() => Promise.resolve(dbPeddler));

			const result = await service.getById(peddlerId);
			expect(result).toBeDefined();
			expect(result.id).toBe(peddlerId);
			expect(prisma.peddler.findUnique).toHaveBeenCalled();
		});

		it("should throw not found error if peddler does not exist", async () => {
			const peddlerId = faker.string.uuid();
			// @ts-ignore
			prisma.peddler.findUnique = mock(() => Promise.resolve(null));

			expect(service.getById(peddlerId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.peddler.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update a peddler by id", async () => {
			const peddlerId = faker.string.uuid();
			const existingPeddler = {
				id: peddlerId,
				lastName: "OldLastName",
				sex: "M",
				codename: "OldRegion_OldLastName_M",
				mainRegion: { id: faker.string.uuid(), name: "OldRegion" },
			};
			const mainRegion = { id: faker.string.uuid(), name: "NewRegion", photoPath: null };
			const input: UpdatePeddlerInput = {
				lastName: "NewLastName",
				sex: "F",
				mainRegionId: mainRegion.id,
				disabilityIds: [faker.string.uuid()],
				remarks: faker.lorem.sentence(),
				// ...other fields...
			};

			// mock get existing peddler
			// @ts-ignore
			prisma.peddler.findUnique = mock(() => Promise.resolve(existingPeddler));

			// @ts-ignore
			prisma.region.findUnique = mock(() => Promise.resolve(mainRegion));

			const updatedPeddler = {
				id: peddlerId,
				lastName: input.lastName,
				sex: input.sex,
				codename: `${mainRegion.name}_${input.lastName}_${input.sex}`,
			};
			// @ts-ignore
			prisma.peddler.update = mock(() => Promise.resolve(updatedPeddler));
			// @ts-ignore
			prisma.peddlerDisability.deleteMany = mock(() => Promise.resolve({}));
			// @ts-ignore
			prisma.peddlerDisability.createMany = mock(() => Promise.resolve({}));
			// mock getById after update
			// @ts-ignore
			prisma.peddler.findUnique = mock(() =>
				Promise.resolve({
					...updatedPeddler,
					mainRegion,
					disabilities: [{ id: faker.string.uuid(), disability: { name: "UpdatedDisability" } }],
				}),
			);

			const result = await service.updateById(peddlerId, input);
			expect(result).toBeDefined();
			expect(result.codename).toBe(
				`${mainRegion.name}_${input.lastName}_${input.sex as "M" | "F"}`,
			);
			expect(prisma.peddler.update).toHaveBeenCalled();
			expect(prisma.peddlerDisability.deleteMany).toHaveBeenCalled();
			expect(prisma.peddlerDisability.createMany).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete a peddler by id", async () => {
			const peddlerId = faker.string.uuid();
			// @ts-ignore
			prisma.peddler.delete = mock(() => Promise.resolve({ id: peddlerId }));
			await service.deleteById(peddlerId);
			expect(prisma.peddler.delete).toHaveBeenCalled();
		});
	});
});
