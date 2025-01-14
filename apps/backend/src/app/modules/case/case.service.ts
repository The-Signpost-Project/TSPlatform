import { Injectable } from "@nestjs/common";
import { PrismaService, S3Service } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { CreateCaseInput, UpdateCaseInput } from "@shared/common/types";
import { CrudService } from "@base";
import type { StrictCase } from "@shared/common/types";
import type { Prisma } from "@prisma/client";

@Injectable()
export class CaseService extends CrudService<StrictCase> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3: S3Service,
	) {
		super();
	}

	private rawCaseFindFields = {
		createdBy: {
			select: {
				id: true,
				username: true,
			},
		},
		region: {
			select: {
				id: true,
				name: true,
			},
		},
		peddler: {
			select: {
				id: true,
				codename: true,
			},
		},
		photos: {
			select: {
				photoPath: true,
			},
		},
		interactionDate: true,
		location: true,
		notes: true,
		importance: true,
		firstInteraction: true,
		createdAt: true,
		updatedAt: true,
		id: true,
	} as const;

	private async parseCase(
		input: Prisma.CaseGetPayload<{
			select: InstanceType<typeof CaseService>["rawCaseFindFields"];
		}>,
	): Promise<StrictCase> {
		return {
			id: input.id,
			createdById: input.createdBy.id,
			createdByUsername: input.createdBy.username,

			regionId: input.region.id,
			regionName: input.region.name,
			peddlerId: input.peddler.id,
			peddlerCodename: input.peddler.codename,
			photoPaths: await Promise.all(
				input.photos.map(async (photo) => await this.s3.getUrl(photo.photoPath)),
			),
			interactionDate: input.interactionDate,
			location: input.location,
			notes: input.notes,
			importance: input.importance as 1 | 2 | 3 | 4 | 5,
			firstInteraction: input.firstInteraction,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}

	// @ts-expect-error
	async create(data: CreateCaseInput) {
		// TODO
	}

	async getAll() {
		try {
			const res = await this.prisma.case.findMany({
				select: this.rawCaseFindFields,
			});
			return Promise.all(res.map(this.parseCase));
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const res = await this.prisma.case.findUnique({
				where: { id },
				select: this.rawCaseFindFields,
			});
			if (!res) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return this.parseCase(res);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	// @ts-expect-error
	async updateById(id: string, data: UpdateCaseInput) {
		// TODO
	}

	async deleteById(id: string) {
		// TODO
	}
}
