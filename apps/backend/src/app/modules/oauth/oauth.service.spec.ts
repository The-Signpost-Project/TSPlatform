import { expect, it, describe, beforeEach, mock, afterEach, spyOn, beforeAll } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { OpenAuthService } from "./oauth.service";
import { AppError } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { OAuth2Tokens } from "arctic";
import type { GoogleUser } from "./types";

mock.module("arctic", () => ({
	generateState: () => faker.word.noun(),

	Google: class {
		createAuthorizationURL() {
			return new URL(`http://${faker.internet.domainName()}`);
		}
		async validateAuthorizationCode() {
			return new OAuth2Tokens({
				access_token: faker.string.alphanumeric(),
			});
		}
	},
}));

describe("OpenAuthService", () => {
	let service: OpenAuthService;
	let prismaService: PrismaService;
	let luciaService: LuciaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [OpenAuthService, PrismaService, LuciaService],
		}).compile();

		service = module.get<OpenAuthService>(OpenAuthService);
		prismaService = module.get<PrismaService>(PrismaService);
		luciaService = module.get<LuciaService>(LuciaService);

		await service.onModuleInit();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getGoogleAuthUrl", () => {
		it("should give a valid url and state", async () => {
			// @ts-ignore
			const createAuthorizationURL = spyOn(service.google, "createAuthorizationURL");
			const res = await service.getGoogleAuthUrl();
			expect(res).toHaveProperty("state");
			expect(res).toHaveProperty("url");
			expect(createAuthorizationURL).toHaveBeenCalled();
		});
	});

	describe("handleGoogleCallback", () => {
		beforeEach(() => {
			const mockFetch = mock(
				async () =>
					new Response(
						JSON.stringify({
							sub: faker.string.numeric({ length: 15 }),
							email: faker.internet.email(),
							name: faker.internet.username(),
						} satisfies GoogleUser),
					),
			);
			global.fetch = mockFetch;
		});

		afterEach(() => {
			// @ts-ignore
			global.fetch.mockRestore();
		});

		it("should return a session cookie", async () => {
			const res = await service.handleGoogleCallback(
				faker.string.alphanumeric(),
				faker.string.alphanumeric(),
			);
			expect(res).toHaveProperty("value");
			expect(res).toHaveProperty("expiresAt");
		});

		it("reject if no params passed", async () => {
			expect(service.handleGoogleCallback(undefined, undefined)).rejects.toThrow(AppError);
		});

		it("dont create user if already exists", async () => {
			// @ts-ignore-next-line
			prismaService.oAuthAccount.findFirst = mock(() =>
				Promise.resolve({ user: { id: faker.string.numeric({ length: 15 }) } }),
			);

			// @ts-ignore-next-line
			prismaService.session.create = mock(() => ({
				value: faker.string.numeric({ length: 10 }),
				expiresAt: faker.date.future(),
			}));
			// @ts-ignore-next-line
			luciaService.createSessionCookie = mock(async () => ({
				id: faker.string.numeric({ length: 10 }),
			}));
			// @ts-ignore-next-line
			luciaService.createSession = mock(() => ({
				value: faker.string.numeric({ length: 10 }),
				expiresAt: faker.date.future(),
			}));

			const createOAuthAccount = spyOn(prismaService.oAuthAccount, "create");
			const createAccount = spyOn(prismaService.user, "create");
			const createSession = spyOn(luciaService, "createSession");

			const res = await service.handleGoogleCallback(
				faker.string.alphanumeric(),
				faker.string.alphanumeric(),
			);
			expect(res).toHaveProperty("value");
			expect(res).toHaveProperty("expiresAt");
			expect(createOAuthAccount).not.toHaveBeenCalled();
			expect(createAccount).not.toHaveBeenCalled();
			expect(createSession).toHaveBeenCalled();

			mock.restore();
		});
	});
});
