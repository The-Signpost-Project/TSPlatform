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
import type {
	StrictRole,
	CreateCaseInput,
	CaseFilters,
	UpdateCaseInput,
} from "@shared/common/types";
import { RoleInterceptor, Roles } from "@interceptors";
import { rolesHavePermission } from "@utils/rolesHavePermission";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LoggedInGuard } from "@guards";

@Controller("case")
@UseInterceptors(RoleInterceptor)
export class CaseController {
	constructor(private readonly caseService: CaseService) {}

	@Get("all")
	async getAllCases(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "case", "read")) {
			return await this.caseService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("filter")
	async getFilteredCases(
		// due to query string serialization, importance is a string of comma separated numbers and not an array of numbers
		@Query(new ValidationPipe(CaseFiltersSchema)) filters: Omit<CaseFilters, "importance"> & {
			importance?: string;
		},
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "case", "read")) {
			return await this.caseService.getFiltered({
				...filters,
				importance: filters.importance?.split(",").map(Number) as (1 | 2 | 3 | 4 | 5)[],
			});
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get(":id")
	async getCaseById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "case", "read", { id })) {
			return await this.caseService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("me")
	async getOwnCases(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return await this.caseService.getOwn(tokenId);
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
	async updateCaseById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateCaseInputSchema)) data: UpdateCaseInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "case", "readWrite", { id })) {
			return await this.caseService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete(":id")
	async deleteCaseById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "case", "readWrite", { id })) {
			return await this.caseService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
