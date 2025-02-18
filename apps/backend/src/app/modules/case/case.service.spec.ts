import { expect, it, describe, beforeAll, mock, afterEach } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, S3Service, LuciaService } from "@db/client";
import { CaseService } from "./case.service";
import type { CaseFilters, CreateCaseInput, UpdateCaseInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import type { Prisma, User, Session } from "@prisma/client";
import { getTestFile } from "@utils/test/testFile";

describe("CaseService", () => {
	let service: CaseService;
	let prisma: PrismaService;
	let s3: S3Service;
	let lucia: LuciaService;
	let testCaseId: string;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [CaseService, PrismaService, S3Service, LuciaService],
		}).compile();

		service = module.get<CaseService>(CaseService);
		prisma = module.get<PrismaService>(PrismaService);
		s3 = module.get<S3Service>(S3Service);
		lucia = module.get<LuciaService>(LuciaService);
		testCaseId = faker.string.uuid();
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		const testInput: CreateCaseInput = {
			createdById: faker.string.uuid(),
			regionId: faker.string.uuid(),
			peddlerId: faker.string.uuid(),
			interactionDate: faker.date.recent(),
			location: faker.location.streetAddress(),
			notes: faker.lorem.sentence(),
			importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
			firstInteraction: true,
			photos: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, getTestFile),
		};

		beforeAll(() => {
			s3.upload = mock(async () => faker.system.filePath());
			s3.getUrl = mock(async () => faker.internet.url());

			// @ts-expect-error
			prisma.case.create = mock(
				async () =>
					({
						id: faker.string.uuid(),
						createdBy: { id: testInput.createdById, username: faker.internet.username() },
						region: { id: testInput.regionId, name: faker.location.city() },
						peddler: { id: testInput.peddlerId, codename: faker.internet.username() },
						photos: testInput.photos?.map((photo) => ({ photoPath: photo.path })) ?? [],
						interactionDate: testInput.interactionDate,
						location: testInput.location,
						notes: testInput.notes,
						importance: testInput.importance,
						firstInteraction: testInput.firstInteraction,
						createdAt: faker.date.recent(),
						updatedAt: faker.date.recent(),
					}) satisfies Prisma.CaseGetPayload<{
						select: (typeof CaseService)["rawCaseFindFields"];
					}>,
			);
		});

		it("should create a new case", async () => {
			const res = await service.create(testInput);
			expect(res).toBeDefined();
			expect(res.id).toBeDefined();
			expect(prisma.case.create).toHaveBeenCalled();
			expect(s3.upload).toHaveBeenCalledTimes(testInput.photos?.length ?? 0);
			expect(s3.getUrl).toHaveBeenCalledTimes(testInput.photos?.length ?? 0);
		});
	});

	describe("getAll", () => {
		beforeAll(() => {
			// @ts-expect-error
			prisma.case.findMany = mock(async () =>
				Array.from(
					{ length: 5 },
					() =>
						({
							id: faker.string.uuid(),
							createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
							region: { id: faker.string.uuid(), name: faker.location.city() },
							peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
							photos: [],
							interactionDate: faker.date.recent(),
							location: faker.location.streetAddress(),
							notes: faker.lorem.sentence(),
							importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
							firstInteraction: true,
							createdAt: faker.date.recent(),
							updatedAt: faker.date.recent(),
						}) satisfies Prisma.CaseGetPayload<{
							select: (typeof CaseService)["rawCaseFindFields"];
						}>,
				),
			);
		});

		it("should return all cases", async () => {
			const res = await service.getAll();
			expect(res).toBeDefined();
			expect(res).toHaveLength(5);
			expect(prisma.case.findMany).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		beforeAll(() => {
			// @ts-expect-error
			prisma.case.findUnique = mock(
				async () =>
					({
						id: testCaseId,
						createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
						region: { id: faker.string.uuid(), name: faker.location.city() },
						peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
						photos: [],
						interactionDate: faker.date.recent(),
						location: faker.location.streetAddress(),
						notes: faker.lorem.sentence(),
						importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
						firstInteraction: true,
						createdAt: faker.date.recent(),
						updatedAt: faker.date.recent(),
					}) satisfies Prisma.CaseGetPayload<{
						select: (typeof CaseService)["rawCaseFindFields"];
					}>,
			);
		});

		it("should return a case by id", async () => {
			const result = await service.getById(testCaseId);
			expect(result).toBeDefined();
			expect(result.id).toBe(testCaseId);
			expect(prisma.case.findUnique).toHaveBeenCalledWith({
				where: { id: testCaseId },
				// @ts-expect-error
				select: CaseService.rawCaseFindFields,
			});
		});

		it("should throw an error if case is not found", async () => {
			// @ts-expect-error
			prisma.case.findUnique = mock(async () => null);
			expect(service.getById(testCaseId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
		});
	});

	describe("getFiltered", () => {
		const filter = {
			peddlerId: faker.string.uuid(),
			regionId: faker.string.uuid(),

			importance: Array.from(
				{ length: 5 },
				() => faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
			),
			limit: faker.number.int({ min: 1, max: 10 }),
			offset: faker.number.int({ min: 0, max: 10 }),
			sortBy: ["interactionDate", "importance", "updatedAt"][
				faker.number.int({ min: 0, max: 2 })
			] as "interactionDate" | "importance" | "updatedAt",
			order: ["asc", "desc"][faker.number.int({ min: 0, max: 1 })] as "asc" | "desc",
		} satisfies CaseFilters;

		beforeAll(() => {
			// @ts-expect-error
			prisma.case.findMany = mock(async () =>
				Array.from(
					{ length: 5 },
					() =>
						({
							id: faker.string.uuid(),
							createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
							region: { id: faker.string.uuid(), name: faker.location.city() },
							peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
							photos: [],
							interactionDate: faker.date.recent(),
							location: faker.location.streetAddress(),
							notes: faker.lorem.sentence(),
							importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
							firstInteraction: true,
							createdAt: faker.date.recent(),
							updatedAt: faker.date.recent(),
						}) satisfies Prisma.CaseGetPayload<{
							select: (typeof CaseService)["rawCaseFindFields"];
						}>,
				),
			);
		});

		it("should return filtered cases", async () => {
			const res = await service.getFiltered(filter);
			expect(res).toBeDefined();
			expect(res).toHaveLength(5);
			expect(prisma.case.findMany).toHaveBeenCalled();

			expect(prisma.case.findMany).toHaveBeenCalledWith({
				where: {
					peddlerId: filter.peddlerId,
					regionId: filter.regionId,
					importance: { in: filter.importance },
				},
				take: filter.limit,
				skip: filter.offset,
				orderBy: {
					[filter.sortBy]: filter.order,
				},
				// @ts-expect-error
				select: CaseService.rawCaseFindFields,
			});
		});
	});

	describe("getOwn", () => {
		const userId = faker.string.uuid();

		beforeAll(() => {
			// @ts-expect-error
			prisma.case.findMany = mock(async () =>
				Array.from(
					{ length: 5 },
					() =>
						({
							id: faker.string.uuid(),
							createdBy: { id: userId, username: faker.internet.username() },
							region: { id: faker.string.uuid(), name: faker.location.city() },
							peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
							photos: [],
							interactionDate: faker.date.recent(),
							location: faker.location.streetAddress(),
							notes: faker.lorem.sentence(),
							importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
							firstInteraction: true,
							createdAt: faker.date.recent(),
							updatedAt: faker.date.recent(),
						}) satisfies Prisma.CaseGetPayload<{
							select: (typeof CaseService)["rawCaseFindFields"];
						}>,
				),
			);

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
		});

		it("should return cases created by the user", async () => {
			const res = await service.getOwn(userId);
			expect(res).toBeDefined();
			expect(res).toHaveLength(5);
			expect(prisma.case.findMany).toHaveBeenCalled();
		});

		it("users without cases should return an empty array", async () => {
			// @ts-expect-error
			prisma.case.findMany = mock(async () => []);
			const res = await service.getOwn(userId);
			expect(res).toBeDefined();
			expect(res).toHaveLength(0);
			expect(prisma.case.findMany).toHaveBeenCalled();
		});

		it("should throw an error if user is not found", async () => {
			lucia.validateSessionToken = mock(async () => ({ user: null, session: null }));
			expect(service.getOwn(userId)).rejects.toThrow(new AppError(AppErrorTypes.InvalidToken));
		});
	});

	describe("updateById", () => {
		const updateInput: UpdateCaseInput = {
			regionId: faker.string.uuid(),
			peddlerId: faker.string.uuid(),
			interactionDate: faker.date.recent(),
			location: faker.location.streetAddress(),
			notes: faker.lorem.sentence(),
			importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
			firstInteraction: true,
			photos: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, getTestFile),
		};

		beforeAll(() => {
			s3.upload = mock(async () => faker.system.filePath());
			s3.getUrl = mock(async () => faker.internet.url());

			// @ts-expect-error
			prisma.case.update = mock(
				async () =>
					({
						id: testCaseId,
						createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
						region: {
							id: updateInput.regionId ?? faker.string.uuid(),
							name: faker.location.city(),
						},
						peddler: {
							id: updateInput.peddlerId ?? faker.string.uuid(),
							codename: faker.internet.username(),
						},
						photos: updateInput.photos?.map((photo) => ({ photoPath: photo.path })) ?? [],
						interactionDate: updateInput.interactionDate ?? faker.date.recent(),
						location: updateInput.location ?? faker.location.streetAddress(),
						notes: updateInput.notes ?? faker.lorem.sentence(),
						importance:
							updateInput.importance ?? (faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5),
						firstInteraction: updateInput.firstInteraction ?? true,
						createdAt: faker.date.recent(),
						updatedAt: faker.date.recent(),
					}) satisfies Prisma.CaseGetPayload<{
						select: (typeof CaseService)["rawCaseFindFields"];
					}>,
			);
		});

		it("should update a case by id", async () => {
			// @ts-expect-error
			prisma.case.findUnique = mock(
				async () =>
					({
						id: testCaseId,
						createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
						region: { id: faker.string.uuid(), name: faker.location.city() },
						peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
						// @ts-expect-error
						photos: [getTestFile()],
						interactionDate: faker.date.recent(),
						location: faker.location.streetAddress(),
						notes: faker.lorem.sentence(),
						importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
						firstInteraction: true,
						createdAt: faker.date.recent(),
						updatedAt: faker.date.recent(),
					}) satisfies Prisma.CaseGetPayload<{
						select: (typeof CaseService)["rawCaseFindFields"];
					}>,
			);

			s3.remove = mock(async () => {});

			const res = await service.updateById(testCaseId, updateInput);
			expect(res).toBeDefined();
			expect(res.id).toBe(testCaseId);
			expect(prisma.case.update).toHaveBeenCalled();
			expect(s3.remove).toHaveBeenCalledTimes(1);
		});

		it("should throw an error if case is not found", async () => {
			// @ts-expect-error
			prisma.case.findUnique = mock(async () => null);
			expect(service.updateById(testCaseId, updateInput)).rejects.toThrow(
				new AppError(AppErrorTypes.NotFound),
			);
		});
	});

	describe("deleteById", () => {
		beforeAll(() => {
			s3.remove = mock(async () => {});

			// @ts-expect-error
			prisma.case.delete = mock(async () => {});
		});

		it("should delete a case by id", async () => {
			// @ts-expect-error
			prisma.case.findUnique = mock(
				async () =>
					({
						id: testCaseId,
						createdBy: { id: faker.string.uuid(), username: faker.internet.username() },
						region: { id: faker.string.uuid(), name: faker.location.city() },
						peddler: { id: faker.string.uuid(), codename: faker.internet.username() },
						// @ts-expect-error
						photos: [getTestFile()],
						interactionDate: faker.date.recent(),
						location: faker.location.streetAddress(),
						notes: faker.lorem.sentence(),
						importance: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
						firstInteraction: true,
						createdAt: faker.date.recent(),
						updatedAt: faker.date.recent(),
					}) satisfies Prisma.CaseGetPayload<{
						select: (typeof CaseService)["rawCaseFindFields"];
					}>,
			);
			const res = await service.deleteById(testCaseId);
			expect(res).not.toBeDefined();
			expect(prisma.case.delete).toHaveBeenCalled();
			expect(s3.remove).toHaveBeenCalled();
		});

		it("should throw an error if case is not found", async () => {
			// @ts-expect-error
			prisma.case.findUnique = mock(async () => null);
			expect(service.deleteById(testCaseId)).rejects.toThrow(new AppError(AppErrorTypes.NotFound));
		});
	});
});
