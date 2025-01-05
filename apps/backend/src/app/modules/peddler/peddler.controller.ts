import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@guards";
import { PeddlerService } from "./peddler.service";
import { DisabilityService } from "./disability.service";
import { RegionService } from "./region.service";
import { ValidationPipe } from "@pipes";
import {
	CreateDisabilityInputSchema,
	CreatePeddlerInputSchema,
	GetDisabilityInputSchema,
	GetPeddlerInputSchema,
	UpdateDisabilityInputSchema,
	UpdatePeddlerInputSchema,
  CreateRegionInputSchema,
  UpdateRegionInputSchema,
  GetRegionInputSchema
} from "@shared/common/schemas";
import type {
	CreateDisabilityInput,
	CreatePeddlerInput,
	UpdateDisabilityInput,
	UpdatePeddlerInput,
  CreateRegionInput,
  UpdateRegionInput
} from "@shared/common/types";

@Controller("user")
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
	@UseGuards(AuthGuard("params", "id"))
	async updateById(
		@Param("id", new ValidationPipe(GetPeddlerInputSchema)) id: string,
		@Body(new ValidationPipe(UpdatePeddlerInputSchema)) data: UpdatePeddlerInput,
	) {
		return await this.peddlerService.updateById(id, data);
	}

	@Delete(":id")
	@UseGuards(AuthGuard("params", "id"))
	async deleteById(@Param("id", new ValidationPipe(GetPeddlerInputSchema)) id: string) {
		return await this.peddlerService.deleteById(id);
	}

	@Get("all")
	async getAll() {
		return await this.peddlerService.getAll();
	}

	@Get(":id")
	async getById(@Param("id", new ValidationPipe(GetPeddlerInputSchema)) id: string) {
		return await this.peddlerService.getById(id);
	}

	@Get("disability/all")
	async getAllDisabilities() {
		return await this.disabilityService.getAll();
	}

	@Get("disability/:id")
	async getDisabilityById(@Param("id", new ValidationPipe(GetDisabilityInputSchema)) id: string) {
		return await this.disabilityService.getById(id);
	}

	@Post("disability")
	async createDisability(
		@Body(new ValidationPipe(CreateDisabilityInputSchema)) data: CreateDisabilityInput,
	) {
		return await this.disabilityService.create(data);
	}

	@Patch("disability/:id")
	async updateDisabilityById(
		@Param("id", new ValidationPipe(GetDisabilityInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateDisabilityInputSchema)) data: UpdateDisabilityInput,
	) {
		return await this.disabilityService.updateById(id, data);
	}

	@Delete("disability/:id")
	async deleteDisabilityById(
		@Param("id", new ValidationPipe(GetDisabilityInputSchema)) id: string,
	) {
		return await this.disabilityService.deleteById(id);
	}

  @Get("region/all")
  async getAllRegions() {
    return await this.regionService.getAll();
  }

  @Get("region/:id")
  async getRegionById(@Param("id", new ValidationPipe(GetRegionInputSchema)) id: string) {
    return await this.regionService.getById(id);
  }

  @Post("region")
  async createRegion(
    @Body(new ValidationPipe(CreateRegionInputSchema)) data: CreateRegionInput,
  ) {
    return await this.regionService.create(data);
  }

  @Patch("region/:id")
  async updateRegionById(
    @Param("id", new ValidationPipe(GetRegionInputSchema)) id: string,
    @Body(new ValidationPipe(UpdateRegionInputSchema)) data: UpdateRegionInput,
  ) {
    return await this.regionService.updateById(id, data);
  }

  @Delete("region/:id")
  async deleteRegionById(
    @Param("id", new ValidationPipe(GetRegionInputSchema)) id: string,
  ) {
    return await this.regionService.deleteById(id);
  }
}
