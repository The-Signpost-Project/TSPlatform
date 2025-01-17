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
} from "@nestjs/common";
import { CaseService } from "./case.service";
import { ValidationPipe, FileValidationPipe } from "@pipes";
import {
	NonEmptyStringSchema,
	CreateCaseInputSchema,
	CaseFiltersSchema,
} from "@shared/common/schemas";
import type { StrictRole, CreateCaseInput, CaseFilters } from "@shared/common/types";
import { RoleInterceptor, Roles } from "@interceptors";
import { rolesHavePermission } from "@utils/rolesHavePermission";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { FilesInterceptor } from "@nestjs/platform-express";

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
		@Query(new ValidationPipe(CaseFiltersSchema)) filters: CaseFilters,
		@Roles() roles: StrictRole[],
	) {
		console.log("filters", filters);
		if (rolesHavePermission(roles, "case", "read")) {
			return await this.caseService.getFiltered(filters);
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
	async createCase(
		@Body(new ValidationPipe(CreateCaseInputSchema)) data: CreateCaseInput,
		@Roles() roles: StrictRole[],
		@UploadedFiles(new FileValidationPipe({ optional: true, multiple: true }))
		photos: Express.Multer.File[],
	) {
		if (rolesHavePermission(roles, "case", "readWrite")) {
			return await this.caseService.create({ ...data, photos });
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	/*
	@Patch(":id")
	async updateDisabilityById(
		@Param("id", new ValidationPipe(GetDisabilityInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateDisabilityInputSchema)) data: UpdateDisabilityInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "readWrite", { id })) {
			return await this.disabilityService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete(":id")
	async deleteDisabilityById(
		@Param("id", new ValidationPipe(GetDisabilityInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "readWrite", { id })) {
			return await this.disabilityService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
    */
}
