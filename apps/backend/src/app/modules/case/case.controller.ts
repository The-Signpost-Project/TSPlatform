import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseInterceptors,
	Req,
	UploadedFiles,
	Query,
	UseGuards,
	Patch,
	Delete,
} from "@nestjs/common";
import { CaseService } from "./case.service";
import { ValidationPipe, FileValidationPipe } from "@pipes";
import {
	NonEmptyStringSchema,
	CreateCaseInputSchema,
	CaseFiltersSchema,
	UpdateCaseInputSchema,
} from "@shared/common/schemas";
import type { CreateCaseInput, CaseFilters, UpdateCaseInput } from "@shared/common/types";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LoggedInGuard } from "@guards";
import { RestrictResourcesInterceptor } from "@interceptors";

@Controller("case")
export class CaseController {
	constructor(private readonly caseService: CaseService) {}

	@Get("all")
	@UseInterceptors(RestrictResourcesInterceptor("case", "read"))
	async getAllCases() {
		return await this.caseService.getAll();
	}

	@Get("filter")
	@UseInterceptors(RestrictResourcesInterceptor("case", "read"))
	async getFilteredCases(
		// due to query string serialization, importance is a string of comma separated numbers and not an array of numbers
		@Query(new ValidationPipe(CaseFiltersSchema)) filters: Omit<CaseFilters, "importance"> & {
			importance?: string;
		},
	) {
		return await this.caseService.getFiltered({
			...filters,
			importance: filters.importance?.split(",").map(Number) as (1 | 2 | 3 | 4 | 5)[],
		});
	}

	@Get("me")
	@UseGuards(LoggedInGuard)
	async getOwnCases(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return await this.caseService.getOwn(tokenId);
	}

	@Get(":id")
	@UseInterceptors(RestrictResourcesInterceptor("case", "read"))
	async getCaseById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.caseService.getById(id);
	}

	@Post()
	@UseInterceptors(FilesInterceptor("photos", 10))
	@UseGuards(LoggedInGuard)
	async createCase(
		@Body(new ValidationPipe(CreateCaseInputSchema)) data: CreateCaseInput,
		@UploadedFiles(new FileValidationPipe({ optional: true, multiple: true }))
		photos: Express.Multer.File[],
	) {
		return await this.caseService.create({ ...data, photos });
	}

	@Patch(":id")
	@UseInterceptors(FilesInterceptor("photos", 10))
	@UseInterceptors(RestrictResourcesInterceptor("case", "readWrite"))
	async updateCaseById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateCaseInputSchema)) data: UpdateCaseInput,

		@UploadedFiles(new FileValidationPipe({ optional: true, multiple: true }))
		photos: Express.Multer.File[],
	) {
		return await this.caseService.updateById(id, { ...data, photos });
	}

	@Delete(":id")
	@UseInterceptors(RestrictResourcesInterceptor("case", "readWrite"))
	async deleteCaseById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.caseService.deleteById(id);
	}
}
