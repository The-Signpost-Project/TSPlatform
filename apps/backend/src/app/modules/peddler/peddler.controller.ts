import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { PeddlerService } from "./peddler.service";
import { DisabilityService } from "./disability.service";
import { RegionService } from "./region.service";
import { ValidationPipe, FileValidationPipe } from "@pipes";
import {
	CreateDisabilityInputSchema,
	CreatePeddlerInputSchema,
	UpdateDisabilityInputSchema,
	UpdatePeddlerInputSchema,
	CreateRegionInputSchema,
	UpdateRegionInputSchema,
	NonEmptyStringSchema,
} from "@shared/common/schemas";
import type {
	CreateDisabilityInput,
	CreatePeddlerInput,
	UpdateDisabilityInput,
	UpdatePeddlerInput,
	CreateRegionInput,
	UpdateRegionInput,
	StrictRole,
} from "@shared/common/types";
import { RoleInterceptor, Roles } from "@interceptors";
import { rolesHavePermission } from "@utils/rolesHavePermission";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";

@Controller("peddler")
@UseInterceptors(RoleInterceptor)
export class PeddlerController {
	constructor(
		private readonly peddlerService: PeddlerService,
		private readonly disabilityService: DisabilityService,
		private readonly regionService: RegionService,
	) {}

	@Post()
	async create(@Body(new ValidationPipe(CreatePeddlerInputSchema)) data: CreatePeddlerInput) {
		return await this.peddlerService.create(data);
	}

	@Patch(":id")
	async updateById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdatePeddlerInputSchema)) data: UpdatePeddlerInput,
	) {
		return await this.peddlerService.updateById(id, data);
	}

	@Delete(":id")
	async deleteById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.peddlerService.deleteById(id);
	}

	@Get("all")
	async getAll() {
		return await this.peddlerService.getAll();
	}

	@Get(":id")
	async getById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.peddlerService.getById(id);
	}

	@Get("disability/all")
	async getAllDisabilities(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "disability", "read")) {
			return await this.disabilityService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("disability/:id")
	async getDisabilityById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "read", { id })) {
			return await this.disabilityService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("disability")
	async createDisability(
		@Body(new ValidationPipe(CreateDisabilityInputSchema)) data: CreateDisabilityInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "readWrite")) {
			return await this.disabilityService.create(data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch("disability/:id")
	async updateDisabilityById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateDisabilityInputSchema)) data: UpdateDisabilityInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "readWrite", { id })) {
			return await this.disabilityService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("disability/:id")
	async deleteDisabilityById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "disability", "readWrite", { id })) {
			return await this.disabilityService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("region/all")
	async getAllRegions(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "region", "read")) {
			return await this.regionService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("region/:id")
	async getRegionById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "region", "read", { id })) {
			return await this.regionService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("region")
	@UseInterceptors(FileInterceptor("photo"))
	async createRegion(
		@Body(new ValidationPipe(CreateRegionInputSchema)) data: CreateRegionInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File | null,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "region", "readWrite")) {
			return await this.regionService.create({ ...data, photo });
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch("region/:id")
	@UseInterceptors(FileInterceptor("photo"))
	async updateRegionById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateRegionInputSchema)) data: UpdateRegionInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File | null,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "region", "readWrite", { id })) {
			return await this.regionService.updateById(id, { ...data, photo });
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("region/:id")
	async deleteRegionById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "region", "readWrite", { id })) {
			return await this.regionService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
