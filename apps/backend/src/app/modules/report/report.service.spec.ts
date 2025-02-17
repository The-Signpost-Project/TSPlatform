import { expect, it, describe, beforeAll, mock, beforeEach, spyOn } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { LuciaService, PrismaService, S3Service } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { faker } from "@faker-js/faker";
import { ReportService } from "./report.service";
import { CaseService } from "../case";
import { PeddlerService } from "../peddler";
import { ConfigService } from "@nestjs/config";
import type { StrictCase, StrictPeddler } from "@shared/common/types";

const mockCaseService = {
	getFiltered: mock(() => [
		...(function* generateCases() {
			for (let i = 0; i < 5; i++) {
				yield {
					id: faker.string.uuid(),
					interactionDate: faker.date.recent(),
					peddlerId: faker.string.uuid(),
				} as StrictCase;
			}
		})(),
	]),
};

const mockPeddlerService = {
	getById: mock(
		(id: string) =>
			({
				id,
				codename: faker.company.name(),
			}) as StrictPeddler,
	),
};
mock.module("docx-templates", () => ({
  createReport: () => Promise.resolve(Buffer.from("fake report")),
}));


describe("AuthService", () => {
	let service: ReportService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3Service,
				LuciaService,
				ConfigService,
				PrismaService,
				ReportService,
				{ provide: CaseService, useValue: mockCaseService },
				{ provide: PeddlerService, useValue: mockPeddlerService },
			],
		}).compile();

		service = module.get<ReportService>(ReportService);
	});

	beforeEach(() => {
		mock.restore();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("pullData", () => {
		it("should fetch cases and peddler", async () => {
			const id = faker.string.uuid();
			const result = await service.pullData(id);
			expect(result).toBeDefined();
			expect(result.cases).toBeDefined();
			expect(result.peddler).toBeDefined();
		});

		it("should throw an error if cases is not found", async () => {
			// @ts-ignore
			mockCaseService.getFiltered = mock(
				() =>
					new Promise(() => {
						throw new Error("Case not found");
					}),
			);
			const id = faker.string.uuid();
			await expect(service.pullData(id)).rejects.toThrow(
				new AppError(AppErrorTypes.GenericError("Failed to fetch cases: Error: Case not found")),
			);
		});

		it("should throw an error if peddler is not found", async () => {
			// @ts-ignore
			mockPeddlerService.getById = mock(
				() =>
					new Promise(() => {
						throw new Error("Peddler not found");
					}),
			);
			const id = faker.string.uuid();
			await expect(service.pullData(id)).rejects.toThrow(
				new AppError(
					AppErrorTypes.GenericError("Failed to fetch peddler: Error: Peddler not found"),
				),
			);
		});
	});

	describe("generateReport", () => {
    
    
		it("should generate a report", async () => {
			
      // @ts-ignore
      service.pullData = mock(() => ({
        cases: [],
        peddler: { id: faker.string.uuid(), codename: faker.company.name() },
      }));

			const id = faker.string.uuid();
      
			expect(service.generateReport(id)).resolves.toBeInstanceOf(Buffer);
		});

    it("should throw an error if createReport fails", async () => {
      // @ts-ignore
      service.pullData = mock(() => ({
        cases: [],
        peddler: { id: faker.string.uuid(), codename: faker.company.name() },
      }));

      // @ts-ignore
      mock.module("docx-templates", () => ({
        createReport: () => Promise.reject(new Error("Failed to create report")),
      }));

      const id = faker.string.uuid();
      await expect(service.generateReport(id)).rejects.toThrow(
        new AppError(AppErrorTypes.GenericError("Failed to generate report: Error: Failed to create report")),
      );

      
    });
	});
});
