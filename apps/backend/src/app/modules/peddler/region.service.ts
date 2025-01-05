import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { CreateRegionInput, UpdateRegionInput } from "@shared/common/types";
import { CrudService } from "@base";
import type { Region } from "@prisma/client";

@Injectable()
export class RegionService extends CrudService<Region> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async create(data: CreateRegionInput) {
		try {
			if (!data.name) {
				throw new AppError(AppErrorTypes.EmptyInput);
			}
			return await this.prisma.region.create({ data });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			return await this.prisma.region.findMany();
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const region = await this.prisma.region.findUnique({ where: { id } });
			if (!region) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return region;
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdateRegionInput) {
		try {
			return await this.prisma.region.update({ where: { id }, data });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			await this.prisma.region.delete({ where: { id } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
