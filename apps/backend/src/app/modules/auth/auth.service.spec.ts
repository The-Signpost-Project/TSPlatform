import { expect, it, describe, beforeAll, mock, beforeEach, spyOn } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { AuthService } from "./auth.service";
import type {
	ChangePasswordInput,
	ForgotPasswordReset,
	SignInInput,
	SignUpInput,
} from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import type { User, Session } from "@prisma/client";

describe("AuthService", () => {
	let service: AuthService;
	let lucia: LuciaService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [AuthService, PrismaService, LuciaService],
		}).compile();

		service = module.get<AuthService>(AuthService);
		lucia = module.get<LuciaService>(LuciaService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	beforeEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("signUp", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};

		beforeAll(() => {
			// @ts-expect-error
			prisma.user.create = mock(
				async () =>
					({
						id: faker.string.uuid(),
						username: testInput.username,
						email: testInput.email,
						// @ts-expect-error
						passwordHash: await service.hashPassword(testInput.password),
						createdAt: faker.date.recent(),
						verified: false,
						allowEmailNotifications: true,
					}) satisfies User,
			);

			lucia.generateSessionToken = mock(() => faker.string.uuid());

			lucia.createSession = mock(
				async () =>
					({
						id: faker.string.uuid(),
						userId: faker.string.uuid(),
						expiresAt: faker.date.future(),
					}) satisfies Session,
			);
		});

		it("should create a new user", async () => {
			// biome-ignore lint/suspicious/noExplicitAny: create can be implemented in any way necessary
			const hashPassword = spyOn(service as any, "hashPassword");

			const cookie = await service.signUp(testInput);
			expect(cookie).toBeDefined();
			expect(cookie.value).toBeDefined();
			expect(cookie.expiresAt).toBeDefined();

			expect(hashPassword).toHaveBeenCalled();
			expect(prisma.user.create).toHaveBeenCalledWith({
				data: {
					id: expect.any(String),
					username: testInput.username,
					email: testInput.email,
					passwordHash: expect.any(String),
				},
			});

			expect(lucia.generateSessionToken).toHaveBeenCalled();
			expect(lucia.createSession).toHaveBeenCalledWith(cookie.value, expect.any(String));
		});
	});

	describe("signIn", () => {
		const testInput: SignInInput = {
			email: faker.internet.email(),

			password: "Password!123",
		};

		beforeAll(() => {
			// @ts-expect-error
			prisma.user.findFirst = mock(
				async () =>
					({
						id: faker.string.uuid(),
						username: faker.internet.username(),
						email: testInput.email,
						// @ts-expect-error
						passwordHash: await service.hashPassword(testInput.password),
						createdAt: faker.date.recent(),
						verified: false,
						allowEmailNotifications: true,
					}) satisfies User,
			);

			mock.module("bun", () => ({
				password: {
					verify: mock(async () => true),
				},
			}));

			lucia.generateSessionToken = mock(() => faker.string.uuid());

			lucia.createSession = mock(
				async () =>
					({
						id: faker.string.uuid(),
						userId: faker.string.uuid(),
						expiresAt: faker.date.future(),
					}) satisfies Session,
			);
		});

		it("should sign in a user", async () => {
			const cookie = await service.signIn(testInput);
			expect(cookie).toBeDefined();
			expect(cookie.value).toBeDefined();
			expect(cookie.expiresAt).toBeDefined();

			expect(prisma.user.findFirst).toHaveBeenCalledWith({
				where: {
					email: testInput.email,
				},
			});

			expect(lucia.generateSessionToken).toHaveBeenCalled();
			expect(lucia.createSession).toHaveBeenCalledWith(cookie.value, expect.any(String));
		});

		it("should throw an error if user is not found", async () => {
			// @ts-expect-error
			prisma.user.findFirst = mock(async () => null);

			expect(service.signIn(testInput)).rejects.toThrow(new AppError(AppErrorTypes.UserNotFound));
		});

		it("should throw an error if no password in db", async () => {
			// @ts-expect-error
			prisma.user.findFirst = mock(async () => ({
				passwordHash: null,
			}));

			expect(service.signIn(testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidCredentials),
			);
		});

		it("should throw an error if password is invalid", async () => {
			mock.module("bun", () => ({
				password: {
					verify: mock(async () => false),
				},
			}));

			expect(service.signIn(testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidCredentials),
			);
		});
	});

	describe("signOut", () => {
		beforeAll(() => {
			lucia.validateSessionToken = mock(
				async () =>
					({
						session: {
							id: faker.string.uuid(),
							userId: faker.string.uuid(),
							expiresAt: faker.date.future(),
						},
						user: {
							id: faker.string.uuid(),
							username: faker.internet.username(),
							email: faker.internet.email(),
							passwordHash: faker.internet.password(),
							createdAt: faker.date.recent(),
							verified: false,
							allowEmailNotifications: true,
						},
					}) satisfies { session: Session; user: User },
			);
			lucia.invalidateSession = mock(async () => {});
		});
		it("should sign out a user", async () => {
			expect(service.signOut(faker.string.uuid())).resolves.toBeUndefined();

			expect(lucia.validateSessionToken).toHaveBeenCalled();
			expect(lucia.invalidateSession).toHaveBeenCalled();
		});

		it("should throw an error if session is not found", async () => {
			lucia.validateSessionToken = mock(async () => ({ session: null, user: null }));

			expect(service.signOut(faker.string.uuid())).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidToken),
			);
		});
	});

	describe("changePassword", () => {
		const testInput: ChangePasswordInput = {
			oldPassword: "Password!123",
			newPassword: "Password!1234",
			repeatPassword: "Password!1234",
		};

		beforeAll(() => {
			// @ts-expect-error
			prisma.user.findUnique = mock(async () => ({
				// @ts-expect-error
				passwordHash: await service.hashPassword(testInput.oldPassword),
			}));

			mock.module("bun", () => ({
				password: {
					verify: mock(async () => true),
				},
			}));

			// @ts-expect-error
			prisma.user.update = mock(async () => ({}));
		});

		it("should change the password", async () => {
			// biome-ignore lint/suspicious/noExplicitAny: create can be implemented in any way necessary
			const hashPassword = spyOn(service as any, "hashPassword");
			expect(service.changePassword(faker.string.uuid(), testInput)).resolves.toBeUndefined();

			expect(hashPassword).toHaveBeenCalled();
			expect(prisma.user.findUnique).toHaveBeenCalled();
			expect(prisma.user.update).toHaveBeenCalled();
		});

		it("should throw an error if new password does not equal repeat password", async () => {
			expect(
				service.changePassword(faker.string.uuid(), {
					...testInput,
					repeatPassword: "Password!12345",
				}),
			).rejects.toThrow(AppError);
		});

		it("should throw an error if user is not found", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(async () => null);

			expect(service.changePassword(faker.string.uuid(), testInput)).rejects.toThrow(AppError);
		});

		it("should throw an error if user has no password and tries to change password", async () => {
			// @ts-expect-error
			prisma.user.findUnique = mock(async () => ({ passwordHash: null }));
			// biome-ignore lint/suspicious/noExplicitAny: create can be implemented in any way necessary
			const hashPassword = spyOn(service as any, "hashPassword");
			expect(service.changePassword(faker.string.uuid(), testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidCredentials),
			);
			expect(hashPassword).not.toHaveBeenCalled();
		});

		it("should throw an error if old password is invalid", async () => {
			mock.module("bun", () => ({
				password: {
					verify: mock(async () => false),
				},
			}));
			// biome-ignore lint/suspicious/noExplicitAny: create can be implemented in any way necessary
			const hashPassword = spyOn(service as any, "hashPassword");

			expect(service.changePassword(faker.string.uuid(), testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidCredentials),
			);
			expect(hashPassword).not.toHaveBeenCalled();
		});
	});

	describe("resetPassword", () => {
		const testInput: ForgotPasswordReset = {
			token: faker.string.uuid(),
			newPassword: "Password!1234",
		};

		beforeAll(() => {
			// @ts-expect-error
			prisma.passwordResetToken.findFirst = mock(async () => ({
				userId: faker.string.uuid(),
			}));

			// @ts-expect-error
			prisma.user.update = mock(async () => ({}));

			// @ts-expect-error
			prisma.passwordResetToken.delete = mock(async () => {});
		});

		it("should reset the password", async () => {
			expect(service.resetPassword(testInput)).resolves.toBeUndefined();

			expect(prisma.passwordResetToken.findFirst).toHaveBeenCalled();
			expect(prisma.user.update).toHaveBeenCalled();
			expect(prisma.passwordResetToken.delete).toHaveBeenCalled();
		});

		it("should throw an error if token is invalid", async () => {
			// @ts-expect-error
			prisma.passwordResetToken.findFirst = mock(async () => null);

			expect(service.resetPassword(testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidToken),
			);
		});
	});

	describe("verifyEmail", () => {
		const testInput = faker.string.uuid();

		beforeAll(() => {
			// @ts-expect-error
			prisma.verificationToken.findFirst = mock(async () => ({
				userId: faker.string.uuid(),
			}));

			// @ts-expect-error
			prisma.user.update = mock(async () => {});

			// @ts-expect-error
			prisma.verificationToken.delete = mock(async () => {});
		});

		it("should verify the email", async () => {
			expect(service.verifyEmail(testInput)).resolves.toBeUndefined();

			expect(prisma.verificationToken.findFirst).toHaveBeenCalled();
			expect(prisma.user.update).toHaveBeenCalled();
			expect(prisma.verificationToken.delete).toHaveBeenCalled();
		});

		it("should throw an error if token is invalid", async () => {
			// @ts-expect-error
			prisma.verificationToken.findFirst = mock(async () => null);

			expect(service.verifyEmail(testInput)).rejects.toThrow(
				new AppError(AppErrorTypes.InvalidToken),
			);
		});
	});
});
