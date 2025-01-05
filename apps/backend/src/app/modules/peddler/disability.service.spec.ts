import { expect, it, describe, beforeEach } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { AppError } from "@utils/appErrors";
import { resetDatabase } from "@utils/test";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { DisabilityService } from "./disability.service";

describe("DisabilityService", () => {
	let service: DisabilityService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [DisabilityService, PrismaService],
		}).compile();

		service = module.get<DisabilityService>(DisabilityService);
		await resetDatabase();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", async () => {
		it("should create a new disability", async () => {
			const name = faker.lorem.word();
			const res = await service.create({ name });
			expect(res).toMatchObject({ name, id: expect.any(String) });
		});

		it("should throw an error if the name is empty", async () => {
			expect(service.create({ name: "" })).rejects.toThrow(AppError);
		});
	});

	describe("getAll", async () => {
		beforeEach(async () => {
			await service.create({ name: "test1" });
			await service.create({ name: "test2" });
			await service.create({ name: "test3" });
		});

		it("should return all disabilities", async () => {
			const res = await service.getAll();
			expect(res).toHaveLength(3);
		});

		it("should return all disabilities with the correct name", async () => {
			const res = await service.getAll();
			expect(res).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ name: "test1" }),
					expect.objectContaining({ name: "test2" }),
					expect.objectContaining({ name: "test3" }),
				]),
			);
		});
	});

	describe("getById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (await service.create({ name: "test" })).id;
		});

		it("should return the correct disability", async () => {
			const res = await service.getById(id);
			expect(res).toMatchObject({ name: "test", id });
		});

		it("should throw an error if the disability does not exist", async () => {
			expect(service.getById("invalidId")).rejects.toThrow(AppError);
		});
	});

	describe("updateById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (await service.create({ name: "test" })).id;
		});

		it("should update the disability", async () => {
			const res = await service.updateById(id, { name: "updated" });
			expect(res).toMatchObject({ name: "updated", id });
		});

		it("should throw an error if the disability does not exist", async () => {
			expect(service.updateById("invalidId", { name: "updated" })).rejects.toThrow(AppError);
		});
	});

	describe("deleteById", async () => {
		let id: string;

		beforeEach(async () => {
			id = (await service.create({ name: faker.airline.aircraftType() })).id;
		});

		it("should delete the disability", async () => {
			await service.deleteById(id);
			expect(service.getById(id)).rejects.toThrow(AppError);
		});

		it("should throw an error if the disability does not exist", async () => {
			expect(service.deleteById("invalidId")).rejects.toThrow(AppError);
		});
	});
});
