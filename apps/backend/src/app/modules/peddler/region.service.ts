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
		this.parseRegion = this.parseRegion.bind(this); // Bind the method to the correct context
	}

	private async parseRegion(region: Region) {
		return {
			...region,
			photoPath: region.photoPath ? await this.s3.getUrl(region.photoPath) : null,
		};
	}

	async create(data: CreateRegionInput) {
		try {
			const { photo, ...rest } = data;
			let photoPath: string | null = null;
			if (photo) {
				photoPath = await this.s3.upload(photo, { dir: "regions", contentType: photo.mimetype });
			}
			const res = await this.prisma.region.create({ data: { ...rest, photoPath } });
			return this.parseRegion(res);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			const res = await this.prisma.region.findMany();
			return Promise.all(res.map(this.parseRegion));
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
			return this.parseRegion(region);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdateRegionInput) {
		try {
			const { photo, ...rest } = data;
			if (photo) {
				// get the previous photoPath
				const { photoPath: prevPhotoPath } =
					(await this.prisma.region.findUnique({ where: { id }, select: { photoPath: true } })) ??
					{};
				// delete the previous photo
				if (prevPhotoPath) {
					await this.s3.remove(prevPhotoPath);
				}
				// upload the new photo

				const photoPath = await this.s3.upload(photo, {
					dir: "regions",
					contentType: photo.mimetype,
				});
				return await this.prisma.region.update({ where: { id }, data: { ...rest, photoPath } });
			}
			return await this.prisma.region.update({ where: { id }, data: rest });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			const { photoPath } = await this.prisma.region.delete({
				where: { id },
				select: { photoPath: true },
			});
			if (photoPath) {
				await this.s3.file(photoPath).delete();
			}
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
