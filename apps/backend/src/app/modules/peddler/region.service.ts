import { Injectable } from "@nestjs/common";
import { PrismaService, S3Service } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { CreateRegionInput, UpdateRegionInput } from "@shared/common/types";
import { CrudService } from "@base";
import type { Region } from "@prisma/client";

@Injectable()
export class RegionService extends CrudService<Region> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3: S3Service,
	) {
		super();
	}

	async create(data: CreateRegionInput) {
		try {
			const { photo, ...rest } = data;
			let photoPath: string | null = null;
			if (photo) {
				console.log(photo);
				photoPath = await this.s3.upload(photo, { dir: "regions", contentType: photo.mimetype });
			}
			const res = await this.prisma.region.create({ data: { ...rest, photoPath } });
			return { ...res, photoPath: photoPath ? await this.s3.getUrl(photoPath) : null };
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
