import { expect, it, describe, mock, beforeAll, afterEach } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { UserService } from "./user.service";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { Prisma } from "@prisma/client";

describe("UserService", () => {
	let service: UserService;
	let lucia: LuciaService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [UserService, PrismaService, LuciaService],
		}).compile();

		service = module.get<UserService>(UserService);
		lucia = module.get<LuciaService>(LuciaService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
	describe("cleanUserData", () => {
		it("should return the user data without the password", () => {
			const user = {
				id: faker.string.uuid(),
				email: faker.internet.email(),
				passwordHash: faker.internet.password(),
				username: faker.internet.username(),
				createdAt: faker.date.recent(),
				verified: false,
				allowEmailNotifications: false,
				oauthAccounts: [],
			} satisfies Prisma.UserGetPayload<{
				select: (typeof UserService)["rawUserFindFields"];
			}>;

			const cleanedUser = service.cleanUserData(user);
			expect(cleanedUser).toEqual({
				id: user.id,
				email: user.email,
				username: user.username,
				createdAt: user.createdAt,
				verified: user.verified,
				allowEmailNotifications: user.allowEmailNotifications,
				oAuthProviders: [],
				hasPassword: true,
			});
		});
	});
	describe("getBySessionId", () => {
		it("should throw an error if no token is provided", async () => {
			expect(service.getBySessionId(undefined)).rejects.toThrowError(AppError);
		});

		it("should throw an error if the token is invalid", async () => {
			expect(service.getBySessionId("invalid-token")).rejects.toThrowError(AppError);
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
			expect(service.getById(faker.string.uuid())).rejects.toThrowError(AppError);
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
			service.getById = mock(() => {
				throw new AppError(AppErrorTypes.UserNotFound);
			});

			expect(service.updateById(faker.string.uuid(), {})).rejects.toThrow(
				new AppError(AppErrorTypes.UserNotFound),
			);
		});

		it("should update the user roles if they are provided", async () => {
			const role = await prisma.role.create({ data: { name: faker.lorem.word() } });
			// @ts-expect-error
			service.getById = mock(() => []);
			// @ts-expect-error
			prisma.user.update = mock(() => ({}));
			// @ts-expect-error
			prisma.userRole.createMany = mock(() => {});
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({ id: faker.string.uuid() }));
			// @ts-expect-error
			service.cleanUserData = mock(() => {});

			// @ts-ignore
			prisma.userRole.deleteMany = mock(() => {});
			// @ts-ignore
			prisma.userRole.createMany = mock(() => {});

			await service.updateById(faker.string.uuid(), { roles: [{ roleId: role.id }] });
			expect(prisma.userRole.deleteMany).toHaveBeenCalled();
			expect(prisma.userRole.createMany).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should throw an error if the user does not exist", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => null);
			expect(service.deleteById(faker.string.uuid())).rejects.toThrowError(AppError);
		});

		it("should delete the user if it exists", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(() => ({}));
			// @ts-expect-error
			prisma.user.delete = mock(() => {});
			expect(service.deleteById(faker.string.uuid())).resolves.toBeUndefined();
		});
	});

	describe("getAll", () => {
		it("should return all users", async () => {
			// @ts-expect-error
			prisma.user.findMany = mock(() => []);
			// @ts-expect-error
			service.cleanUserData = mock(() => ({}));
			const users = await service.getAll();
			expect(users).toBeDefined();
			expect(users).toHaveLength(0);
		});
	});
});
