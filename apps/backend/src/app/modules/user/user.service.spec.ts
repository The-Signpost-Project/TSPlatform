import { expect, it, describe, beforeEach, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { UserService } from "./user.service";
import { AppError } from "@utils/appErrors";
import { resetDatabase } from "@utils/test";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";

describe("UserService", () => {
	let service: UserService;
	let lucia: LuciaService;
	let prisma: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [UserService, PrismaService, LuciaService],
		}).compile();

		service = module.get<UserService>(UserService);
		lucia = module.get<LuciaService>(LuciaService);
		prisma = module.get<PrismaService>(PrismaService);
		await resetDatabase();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getBySessionId", () => {
		it("should throw an error if no token is provided", async () => {
			await expect(service.getBySessionId(undefined)).rejects.toThrowError(AppError);
		});

		it("should throw an error if the token is invalid", async () => {
			await expect(service.getBySessionId("invalid-token")).rejects.toThrowError(AppError);
		});

		it("should return the user if the token is valid", async () => {
			// @ts-expect-error
			lucia.validateSessionToken = mock(() => ({ session: {}, user: { id: faker.string.uuid() } }));
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const user = await service.getBySessionId("valid-token");
			expect(user).toBeDefined();
		});
	});

	describe("getById", () => {
		it("should return the user if it exists", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const user = await service.getById(faker.string.uuid());
			expect(user).toBeDefined();
		});

		it("should throw an error if the user does not exist", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => null);
			await expect(service.getById(faker.string.uuid())).rejects.toThrowError(AppError);
		});
	});

	describe("updateById", () => {
		it("should return the updated user", async () => {
			// @ts-expect-error
			prisma.user.update = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			// @ts-expect-error
			service.getById = mock(() => []);

			const user = await service.updateById(faker.string.uuid(), {});
			expect(user).toBeDefined();
		});

		it("should throw an error if the user does not exist", async () => {
			prisma.user.update = mock(() => {
				throw new Error();
			});
			await expect(service.updateById(faker.string.uuid(), {})).rejects.toThrowError(AppError);
		});
	});

	describe("deleteById", () => {
		it("should throw an error if the user does not exist", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => null);
			await expect(service.deleteById(faker.string.uuid())).rejects.toThrowError(AppError);
		});

		it("should delete the user if it exists", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			prisma.user.delete = mock(() => {});
			expect(service.deleteById(faker.string.uuid())).resolves.toBeUndefined();
		});
	});
});
