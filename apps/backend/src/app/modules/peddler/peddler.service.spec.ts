import { expect, it, describe, beforeEach } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { AppError } from "@utils/appErrors";
import { resetDatabase } from "@utils/test";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { PeddlerService } from "./peddler.service";
import { RegionService } from "./region.service";

describe("PeddlerService", () => {
	let service: PeddlerService;
	let testRegion: { id: string; name: string };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [PeddlerService, PrismaService, RegionService],
		}).compile();

		service = module.get<PeddlerService>(PeddlerService);
		await resetDatabase();

		const regionService = module.get<RegionService>(RegionService);
		testRegion = await regionService.create({ name: faker.location.city(), photo: null });
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", async () => {
		it("should create a new peddler", async () => {
			const res = await service.create({
				mainRegion: testRegion,
				lastName: faker.person.lastName(),
				firstName: faker.person.firstName(),
				// @ts-ignore
				race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
				// @ts-ignore
				sex: ["M", "F"][Math.floor(Math.random() * 2)],
				birthYear: faker.date.past().getFullYear(),
				disabilities: [],
			});
			expect(res).toMatchObject({ id: expect.any(String) });
		});

		it("should throw an error if empty", async () => {
			// @ts-ignore
			expect(service.create({})).rejects.toThrow(AppError);
		});

		it("should throw an error if mainRegion is empty", async () => {
			expect(
				service.create({
					// @ts-ignore
					mainRegion: null,
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					// @ts-ignore
					race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
					// @ts-ignore
					sex: ["M", "F"][Math.floor(Math.random() * 2)],
					birthYear: faker.date.past().getFullYear(),
					disabilities: [],
				}),
			).rejects.toThrow(AppError);
		});
	});

	describe("getAll", async () => {
		beforeEach(async () => {
			for (let i = 0; i < 3; i++) {
				await service.create({
					mainRegion: testRegion,
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					// @ts-ignore
					race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
					// @ts-ignore
					sex: ["M", "F"][Math.floor(Math.random() * 2)],
					birthYear: faker.date.past().getFullYear(),
					disabilities: [],
				});
			}
		});

		it("should return all peddlers", async () => {
			const res = await service.getAll();
			expect(res).toHaveLength(3);
		});

		it("should return an empty array if there are no peddlers", async () => {
			await resetDatabase();
			const res = await service.getAll();
			expect(res).toHaveLength(0);
		});
	});

	describe("getById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (
				await service.create({
					mainRegion: testRegion,
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					// @ts-ignore
					race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
					// @ts-ignore
					sex: ["M", "F"][Math.floor(Math.random() * 2)],
					birthYear: faker.date.past().getFullYear(),
					disabilities: [],
				})
			).id;
		});

		it("should return the correct peddler", async () => {
			const res = await service.getById(id);
			expect(res).toMatchObject({ id });
		});

		it("should throw an error if the peddler does not exist", async () => {
			expect(service.getById("invalidId")).rejects.toThrow(AppError);
		});
	});

	describe("updateById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (
				await service.create({
					mainRegion: testRegion,
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					// @ts-ignore
					race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
					// @ts-ignore
					sex: ["M", "F"][Math.floor(Math.random() * 2)],
					birthYear: faker.date.past().getFullYear(),
					disabilities: [],
				})
			).id;
		});

		it("should update the peddler", async () => {
			const newAttrs = {
				lastName: faker.person.lastName(),
				firstName: faker.person.firstName(),
				sex: "M",
			} as const;
			const res = await service.updateById(id, newAttrs);
			expect(res).toMatchObject({ id, ...newAttrs });
		});
	});

	describe("deleteById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (
				await service.create({
					mainRegion: testRegion,
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					// @ts-ignore
					race: ["Chinese", "Malay", "Indian", "Others"][Math.floor(Math.random() * 4)],
					// @ts-ignore
					sex: ["M", "F"][Math.floor(Math.random() * 2)],
					birthYear: faker.date.past().getFullYear(),
					disabilities: [],
				})
			).id;
		});

		it("should delete the peddler", async () => {
			await service.deleteById(id);
			expect(service.getById(id)).rejects.toThrow(AppError);
		});

		it("should throw an error if the peddler does not exist", async () => {
			expect(service.deleteById("invalidId")).rejects.toThrow(AppError);
		});
	});
});
