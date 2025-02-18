import { expect, it, describe, beforeAll, mock, afterEach, spyOn } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, S3Service, LuciaService } from "@db/client";
import type {
	CaseFilters,
	CreateCaseInput,
	CreateTeamInput,
	UpdateCaseInput,
	UpdateTeamInput,
} from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import type { Prisma, User, Session } from "@prisma/client";
import { getTestFile } from "@/utils/test/testFile";
import { UserService } from "./user.service";
import { TeamService } from "./team.service";

describe("TeamService", () => {
	let service: TeamService;
	let prisma: PrismaService;
	let s3: S3Service;
	let userService: UserService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [TeamService, PrismaService, S3Service, UserService, LuciaService],
		}).compile();

		service = module.get<TeamService>(TeamService);
		prisma = module.get<PrismaService>(PrismaService);
		s3 = module.get<S3Service>(S3Service);
		userService = module.get<UserService>(UserService);
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		beforeAll(() => {
			s3.getUrl = mock(() => Promise.resolve(faker.internet.url()));
		});
		it("should create a team", async () => {
			s3.upload = mock(() => Promise.resolve(faker.string.uuid()));
			// @ts-ignore
			prisma.team.create = mock(() =>
				Promise.resolve({
					name: faker.company.name(),
					members: [],
					photoPath: faker.string.uuid(),
				}),
			);

			const input: CreateTeamInput = {
				name: faker.company.name(),
				photo: getTestFile(),
			};

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(s3.upload).toHaveBeenCalled();
			expect(prisma.team.create).toHaveBeenCalled();
		});

		it("should create a team without photo", async () => {
			// @ts-ignore
			prisma.team.create = mock(() =>
				Promise.resolve({
					name: faker.company.name(),
					members: [],
					photoPath: null,
				}),
			);

			const input: CreateTeamInput = {
				name: faker.company.name(),
				photo: null,
			};

			const result = await service.create(input);
			expect(result).toBeDefined();
			expect(prisma.team.create).toHaveBeenCalled();
			expect(result.members.length).toBe(0);
		});
	});

	describe("getById", () => {
		it("should get team by id", async () => {
			const teamId = faker.string.uuid();
			// @ts-ignore
			prisma.team.findUnique = mock(() =>
				Promise.resolve({
					id: teamId,
					name: faker.company.name(),
					members: [],
					photoPath: faker.string.uuid(),
				}),
			);

			const result = await service.getById(teamId);
			expect(result).toBeDefined();
			expect(prisma.team.findUnique).toHaveBeenCalled();
			expect(result.id).toBe(teamId);
		});

		it("should throw not found error", async () => {
			const teamId = faker.string.uuid();
			// @ts-ignore
			prisma.team.findUnique = mock(() => Promise.resolve(null));

			await expect(service.getById(teamId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
			expect(prisma.team.findUnique).toHaveBeenCalled();
		});
	});

	describe("updateById", () => {
		it("should update team by id", async () => {
			const teamId = faker.string.uuid();

			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: faker.string.uuid(),
			};

			// @ts-ignore
			prisma.team.update = mock(() => Promise.resolve(testTeam));

			// @ts-ignore
			service.getById = mock(() => ({}));

			const input: UpdateTeamInput = {
				name: faker.company.name(),
				photo: getTestFile(),
			};

			const result = await service.updateById(teamId, input);
			expect(result).toBeDefined();
			expect(prisma.team.update).toHaveBeenCalled();
			expect(result.id).toBe(teamId);
		});

		it("should update team by id without photo", async () => {
			const teamId = faker.string.uuid();

			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: faker.string.uuid(),
			};

			// @ts-ignore
			prisma.team.update = mock(() => Promise.resolve(testTeam));

			// @ts-ignore
			service.getById = mock(() => ({}));

			const input: UpdateTeamInput = {
				name: faker.company.name(),
				photo: null,
			};

			const s3Spy = spyOn(s3, "remove");

			const result = await service.updateById(teamId, input);
			expect(result).toBeDefined();
			expect(prisma.team.update).toHaveBeenCalled();
			expect(result.id).toBe(teamId);
			expect(s3Spy).not.toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		it("should delete team by id", async () => {
			const teamId = faker.string.uuid();
			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: faker.string.uuid(),
			};

			// @ts-ignore
			prisma.team.delete = mock(() => Promise.resolve(testTeam));

			// @ts-ignore
			service.getById = mock(() => ({}));
			await service.deleteById(teamId);
			expect(prisma.team.delete).toHaveBeenCalled();
		});

		it("should not remove photo if it does not exist", async () => {
			const teamId = faker.string.uuid();
			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: null,
			};

			// @ts-ignore
			prisma.team.delete = mock(() => Promise.resolve(testTeam));

			// @ts-ignore
			service.getById = mock(() => ({}));

			const s3Spy = spyOn(s3, "remove");

			await service.deleteById(teamId);
			expect(prisma.team.delete).toHaveBeenCalled();
			expect(s3Spy).not.toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should get all teams", async () => {
			// @ts-ignore
			prisma.team.findMany = mock(() =>
				Promise.resolve([
					{
						id: faker.string.uuid(),
						name: faker.company.name(),
						members: [],
						photoPath: faker.string.uuid(),
					},
				]),
			);

			const result = await service.getAll();
			expect(result).toBeDefined();
			expect(prisma.team.findMany).toHaveBeenCalled();
		});
	});

	describe("addMember", () => {
		it("should add member to team", async () => {
			const teamId = faker.string.uuid();
			const userId = faker.string.uuid();

			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: faker.string.uuid(),
			};

			// @ts-ignore
			prisma.userTeam.create = mock(() => Promise.resolve({}));

			expect(service.addMember(teamId, userId)).resolves.toBeUndefined();
		});
	});

	describe("deleteMember", () => {
		it("should remove member from team", async () => {
			const teamId = faker.string.uuid();
			const userId = faker.string.uuid();

			const testTeam = {
				id: teamId,
				name: faker.company.name(),
				members: [],
				photoPath: faker.string.uuid(),
			};

			// @ts-ignore
			prisma.userTeam.delete = mock(() => Promise.resolve({}));

			expect(service.deleteMember(teamId, userId)).resolves.toBeUndefined();
		});
	});
});
