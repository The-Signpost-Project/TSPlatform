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

	describe("getUserBySessionId", () => {
		it("should throw an error if no token is provided", async () => {
			await expect(service.getUserBySessionId(undefined)).rejects.toThrowError(AppError);
		});

		it("should throw an error if the token is invalid", async () => {
			await expect(service.getUserBySessionId("invalid-token")).rejects.toThrowError(AppError);
		});

		it("should return the user if the token is valid", async () => {
			// @ts-expect-error
			lucia.validateSessionToken = mock(() => ({ session: {}, user: { id: faker.string.uuid() } }));
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const user = await service.getUserBySessionId("valid-token");
			expect(user).toBeDefined();
		});
	});

	describe("getUserById", () => {
		it("should return the user if it exists", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const user = await service.getUserById(faker.string.uuid());
			expect(user).toBeDefined();
		});

		it("should throw an error if the user does not exist", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => null);
			await expect(service.getUserById(faker.string.uuid())).rejects.toThrowError(AppError);
		});
	});

	describe("updateUserById", () => {
		it("should return the updated user", async () => {
			// @ts-expect-error
			prisma.user.update = mock(() => ({}));
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const user = await service.updateUserById(faker.string.uuid(), {});
			expect(user).toBeDefined();
		});

		it("should throw an error if the user does not exist", async () => {
			prisma.user.update = mock(() => {
				throw new Error();
			});
			await expect(service.updateUserById(faker.string.uuid(), {})).rejects.toThrowError(AppError);
		});
	});

	describe("deleteUserById", () => {
		it("should throw an error if the user does not exist", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => null);
			await expect(service.deleteUserById(faker.string.uuid())).rejects.toThrowError(AppError);
		});

		it("should delete the user if it exists", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			prisma.user.delete = mock(() => {});
			expect(service.deleteUserById(faker.string.uuid())).resolves.toBeUndefined();
		});
	});
});
