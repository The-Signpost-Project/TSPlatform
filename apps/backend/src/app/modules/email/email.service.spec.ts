import { expect, it, describe, beforeAll, mock, beforeEach, spyOn } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import type { User, Case, Peddler } from "@prisma/client";
import { EmailService } from "./email.service";
import { ConfigService } from "@nestjs/config";

const mockConfigService = {
	get: mock((key: string) => {
		const env = {
			EMAIL_ALERT_ADDRESSES: new Array(5).fill(faker.internet.email()).join(","),
		};
		return env[key as keyof typeof env];
	}),
};
describe("AuthService", () => {
	let service: EmailService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EmailService,
				PrismaService,
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get<EmailService>(EmailService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	beforeEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("sendForgotPasswordEmail", () => {
		const testEmail = faker.internet.email();

		beforeAll(() => {
			// @ts-ignore
			prisma.user.findUnique = mock(
				() =>
					({
						id: faker.string.uuid(),
						username: faker.internet.username(),
					}) as User,
			);

			// @ts-ignore
			prisma.passwordResetToken.upsert = mock(() => ({
				token: faker.string.alphanumeric(32),
			}));
		});

		it("should send a password reset email", async () => {
			// @ts-ignore
			const emailSpy = spyOn(service, "sendEmail").mockResolvedValue();

			await service.sendForgotPasswordEmail(testEmail);

			expect(emailSpy).toHaveBeenCalled();
		});

		it("should throw an error if the user does not exist", async () => {
			// @ts-ignore
			prisma.user.findUnique = mock(() => null);

			await expect(service.sendForgotPasswordEmail(testEmail)).rejects.toThrowError(
				new AppError(AppErrorTypes.UserNotFound),
			);
		});
	});

	describe("sendVerificationEmail", () => {
		const testId = faker.string.uuid();

		beforeAll(() => {
			// @ts-ignore
			prisma.verificationToken.upsert = mock(() => ({
				token: faker.string.alphanumeric(32),
			}));
		});

		it("should send a verification email", async () => {
			// @ts-ignore
			prisma.user.findUnique = mock(
				() =>
					({
						id: testId,
						username: faker.internet.username(),
						email: faker.internet.email(),
						verified: false,
					}) as User,
			);
			// @ts-ignore
			const emailSpy = spyOn(service, "sendEmail").mockResolvedValue();

			await service.sendVerificationEmail(testId);

			expect(emailSpy).toHaveBeenCalled();
		});

		it("should throw an error if the user does not exist", async () => {
			// @ts-ignore
			prisma.user.findUnique = mock(() => null);

			expect(service.sendVerificationEmail(testId)).rejects.toThrowError(
				new AppError(AppErrorTypes.UserNotFound),
			);
		});

		it("should throw an error if the user has no email", async () => {
			// @ts-ignore
			prisma.user.findUnique = mock(
				() => ({ id: testId, username: faker.internet.username() }) as User,
			);

			expect(service.sendVerificationEmail(testId)).rejects.toThrowError(
				new AppError(AppErrorTypes.NoEmail),
			);
		});

		it("should throw an error if the user is already verified", async () => {
			// @ts-ignore
			prisma.user.findUnique = mock(
				() =>
					({
						id: testId,
						username: faker.internet.username(),
						email: faker.internet.email(),
						verified: true,
					}) as User,
			);

			expect(service.sendVerificationEmail(testId)).rejects.toThrowError(
				new AppError(AppErrorTypes.AlreadyVerified),
			);
		});
	});

	describe("sendUrgentCaseEmail", () => {
		const testCaseId = faker.string.uuid();

		beforeAll(() => {
			// @ts-ignore
			prisma.case.findUnique = mock(
				() =>
					({
						id: testCaseId,
						region: { name: faker.location.city() },
						peddler: { codename: faker.internet.username() },
						createdAt: faker.date.recent(),
						notes: faker.lorem.paragraph(),
						importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
						firstInteraction: true,
					}) as Partial<Case>,
			);
		});

		it("should send an urgent case email", async () => {
			// @ts-ignore
			const emailSpy = spyOn(service, "sendEmail").mockResolvedValue();

			await service.sendUrgentCaseEmail(testCaseId);

			expect(emailSpy).toHaveBeenCalledTimes(5);
		});

		it("should throw an error if the case does not exist", async () => {
			// @ts-ignore
			prisma.case.findUnique = mock(() => null);

			expect(service.sendUrgentCaseEmail(testCaseId)).rejects.toThrowError(
				new AppError(AppErrorTypes.NotFound),
			);
		});
	});

	describe("sendNewPeddlerEmail", () => {
		const testPeddlerId = faker.string.uuid();

		beforeAll(() => {
			// @ts-ignore
			prisma.peddler.findUnique = mock(
				() =>
					({
						id: testPeddlerId,
						mainRegion: { name: faker.location.city() },
						disabilities: [
							{ disability: { name: faker.lorem.word() } },
							{ disability: { name: faker.lorem.word() } },
						],
					}) as Partial<Peddler>,
			);
		});

		it("should send a new peddler email", async () => {
			// @ts-ignore
			const emailSpy = spyOn(service, "sendEmail").mockResolvedValue();

			await service.sendNewPeddlerEmail(testPeddlerId);

			expect(emailSpy).toHaveBeenCalled();
		});

		it("should throw an error if the peddler does not exist", async () => {
			// @ts-ignore
			prisma.peddler.findUnique = mock(() => null);

			expect(service.sendNewPeddlerEmail(testPeddlerId)).rejects.toThrowError(
				new AppError(AppErrorTypes.NotFound),
			);
		});
	});
});
