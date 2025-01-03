import { expect, it, describe, beforeEach, beforeAll } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import type { SignUpInput, SignInInput } from "@shared/common/types";
import { resetDatabase, testFetch } from "@utils/test";
import type { INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { UserService } from "../user";

describe("AuthController", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [AuthService, PrismaService, LuciaService, UserService],
			controllers: [AuthController],
		}).compile();

		app = module.createNestApplication();
		app.use(cookieParser());
		await app.init();
	});

	beforeEach(async () => {
		await resetDatabase();
	});

	describe("/signup", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		it("should create a new user", async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					expect(response.status).toBe(201);
					expect(response.headers["set-cookie"]).toBeDefined();
					expect(response.headers["set-cookie"][0]).toContain("tokenId=");
				},
			});
		});

		it("should throw an error for invalid password", async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: {
						...testInput,
						password: "password",
					},
					path: "/auth/signup",
				},
				callback: (response) => {
					expect(response.status).toBe(400);
					expect(response.body.message).toBe("FormValidationError");
				},
			});
		});
	});

	describe("/signin", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};

		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
			});
		});

		it("should sign in a user", async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: {
						email: testInput.email,
						password: testInput.password,
					} satisfies SignInInput,
					path: "/auth/signin",
				},
				callback: (response) => {
					expect(response.status).toBe(201);
					expect(response.headers["set-cookie"]).toBeDefined();
					expect(response.headers["set-cookie"][0]).toContain("tokenId=");
				},
			});
		});
	});

	describe("/signout", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: string;
		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					cookie = (response.headers["set-cookie"] as unknown as string[])[0]
						.split("; ")[0]
						.replace("tokenId=", "");
				},
			});
		});

		it("should sign out a user", async () => {
			await testFetch({
				init: {
					app,
					method: "DELETE",
					path: `/auth/signout/${cookie}`,
				},
				callback: (response) => {
					expect(response.status).toBe(204);
				},
			});
		});
	});

	// moved to user module
	/*
	describe("/me", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: string;
		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					cookie = (response.headers["set-cookie"] as unknown as string[])[0]
						.split("; ")[0]
						.replace("tokenId=", "");
				},
			});
		});

		it("should get a user", async () => {
			await testFetch({
				init: {
					app,
					method: "GET",
					options: {
						headers: {
							Cookie: `tokenId=${cookie}`,
						},
					},
					path: "/user/me",
				},
				callback: (response) => {
					expect(response.status).toBe(200);
					expect(response.body).toBeDefined();
				},
			});
		});
	});
  */
});
