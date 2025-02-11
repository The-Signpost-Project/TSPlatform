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
	UseGuards,
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
} from "@shared/common/types";
import { RestrictResourcesInterceptor } from "@interceptors";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggedInGuard } from "@guards";

@Controller("peddler")
export class PeddlerController {
	constructor(
		private readonly peddlerService: PeddlerService,
		private readonly disabilityService: DisabilityService,
		private readonly regionService: RegionService,
	) {}

	@Post()
	@UseGuards(LoggedInGuard)
	async create(@Body(new ValidationPipe(CreatePeddlerInputSchema)) data: CreatePeddlerInput) {
		return await this.peddlerService.create(data);
	}

	@Patch(":id")
	@UseInterceptors(RestrictResourcesInterceptor("peddler", "readWrite"))
	async updateById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdatePeddlerInputSchema)) data: UpdatePeddlerInput,
	) {
		return await this.peddlerService.updateById(id, data);
	}

	@Delete(":id")
	@UseInterceptors(RestrictResourcesInterceptor("peddler", "readWrite"))
	async deleteById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.peddlerService.deleteById(id);
	}

	@Get("all")
	@UseGuards(LoggedInGuard)
	async getAll() {
		return await this.peddlerService.getAll();
	}

	@Get(":id")
	@UseInterceptors(RestrictResourcesInterceptor("peddler", "read"))
	async getById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.peddlerService.getById(id);
	}

	// public route
	@Get("disability/all")
	@UseGuards(LoggedInGuard)
	async getAllDisabilities() {
		return await this.disabilityService.getAll();
	}

	@Get("disability/:id")
	@UseInterceptors(RestrictResourcesInterceptor("disability", "read"))
	async getDisabilityById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.disabilityService.getById(id);
	}

	@Post("disability")
	@UseInterceptors(RestrictResourcesInterceptor("disability", "readWrite"))
	async createDisability(
		@Body(new ValidationPipe(CreateDisabilityInputSchema)) data: CreateDisabilityInput,
	) {
		return await this.disabilityService.create(data);
	}

	@Patch("disability/:id")
	@UseInterceptors(RestrictResourcesInterceptor("disability", "readWrite"))
	async updateDisabilityById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateDisabilityInputSchema)) data: UpdateDisabilityInput,
	) {
		return await this.disabilityService.updateById(id, data);
	}

	@Delete("disability/:id")
	@UseInterceptors(RestrictResourcesInterceptor("disability", "readWrite"))
	async deleteDisabilityById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.disabilityService.deleteById(id);
	}

	// public route
	@Get("region/all")
	@UseGuards(LoggedInGuard)
	async getAllRegions() {
		return await this.regionService.getAll();
	}

	@Get("region/:id")
	@UseInterceptors(RestrictResourcesInterceptor("region", "read"))
	async getRegionById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.regionService.getById(id);
	}

	@Post("region")
	@UseInterceptors(FileInterceptor("photo"))
	@UseInterceptors(RestrictResourcesInterceptor("region", "readWrite"))
	async createRegion(
		@Body(new ValidationPipe(CreateRegionInputSchema)) data: CreateRegionInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File | null,
	) {
		return await this.regionService.create({ ...data, photo });
	}

	@Patch("region/:id")
	@UseInterceptors(FileInterceptor("photo"))
	@UseInterceptors(RestrictResourcesInterceptor("region", "readWrite"))
	async updateRegionById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateRegionInputSchema)) data: UpdateRegionInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File | null,
	) {
		return await this.regionService.updateById(id, { ...data, photo });
	}

	@Delete("region/:id")
	@UseInterceptors(RestrictResourcesInterceptor("region", "readWrite"))
	async deleteRegionById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.regionService.deleteById(id);
	}
}
