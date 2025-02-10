import { Injectable } from "@nestjs/common";
import { PrismaService, S3Service, LuciaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { CreateCaseInput, UpdateCaseInput } from "@shared/common/types";
import { CrudService } from "@base";
import type { StrictCase, CaseFilters } from "@shared/common/types";
import type { Prisma } from "@prisma/client";

@Injectable()
export class CaseService extends CrudService<StrictCase> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3: S3Service,
		private readonly lucia: LuciaService,
	) {
		super();
		this.create = this.create.bind(this);
		this.parseCase = this.parseCase.bind(this);
	}

	private static rawCaseFindFields = {
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
			select: (typeof CaseService)["rawCaseFindFields"];
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

	async create(data: CreateCaseInput) {
		let photoPaths: string[] = [];
		if (data.photos) {
			photoPaths = await Promise.all(
				data.photos.map(
					async (photo) =>
						await this.s3.upload(photo, { dir: "case-photos", contentType: photo.mimetype }),
				),
			);
		}
		const res = await this.prisma.case.create({
			data: {
				createdBy: {
					connect: { id: data.createdById },
				},
				region: {
					connect: { id: data.regionId },
				},
				peddler: {
					connect: { id: data.peddlerId },
				},
				interactionDate: data.interactionDate,
				location: data.location,
				notes: data.notes,
				importance: data.importance,
				firstInteraction: data.firstInteraction,
				photos: {
					create: photoPaths.map((photoPath) => ({ photoPath })),
				},
			},
			select: CaseService.rawCaseFindFields,
		});
		return this.parseCase(res);
	}

	async getAll() {
		const res = await this.prisma.case.findMany({
			select: CaseService.rawCaseFindFields,
		});
		return Promise.all(res.map(this.parseCase));
	}

	async getById(id: string) {
		const res = await this.prisma.case.findUnique({
			where: { id },
			select: CaseService.rawCaseFindFields,
		});
		if (!res) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		return this.parseCase(res);
	}

	async getFiltered(filters: CaseFilters) {
		const res = await this.prisma.case.findMany({
			where: {
				regionId: filters.regionId,
				peddlerId: filters.peddlerId,
				importance: filters.importance
					? {
							in: filters.importance,
						}
					: undefined,
				createdBy: filters.teamId
					? {
							teams: {
								some: {
									teamId: filters.teamId,
								},
							},
						}
					: undefined,
			},
			select: CaseService.rawCaseFindFields,
			orderBy: {
				[filters.sortBy || "updatedAt"]: filters.order || "desc",
			},
			skip: filters.offset,
			take: filters.limit,
		});
		return Promise.all(res.map(this.parseCase));
	}

	async getOwn(tokenId: string | undefined) {
		if (!tokenId) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		const { session, user } = await this.lucia.validateSessionToken(tokenId);

		if (!session || !user) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		return this.getById(user.id);
	}

	async updateById(id: string, data: UpdateCaseInput) {
		const existingCase = await this.prisma.case.findUnique({
			where: { id },
			select: {
				photos: {
					select: {
						photoPath: true,
					},
				},
			},
		});

		if (!existingCase) {
			throw new AppError(AppErrorTypes.NotFound);
		}

		if (data.photos && data.photos.length > 0) {
			// delete old photos
			await Promise.all(
				existingCase.photos.map(async (photo) => {
					await this.s3.remove(photo.photoPath);
				}),
			);

			// upload new photos
			const photoPaths = await Promise.all(
				data.photos.map(
					async (photo) =>
						await this.s3.upload(photo, { dir: "case-photos", contentType: photo.mimetype }),
				),
			);

			await this.prisma.case.update({
				where: { id },
				data: {
					photos: {
						deleteMany: {},
						create: photoPaths.map((photoPath) => ({ photoPath })),
					},
				},
			});
		}

		const { photos, ...updateData } = data;

		await this.prisma.case.update({
			where: { id },
			data: {
				...updateData,
				updatedAt: new Date(),
			},
		});
		return await this.getById(id);
	}

	async deleteById(id: string) {
		const existingCase = await this.prisma.case.findUnique({
			where: { id },
			select: {
				photos: {
					select: {
						photoPath: true,
					},
				},
			},
		});

		if (!existingCase) {
			throw new AppError(AppErrorTypes.NotFound);
		}

		await Promise.all(
			existingCase.photos.map(async (photo) => {
				await this.s3.remove(photo.photoPath);
			}),
		);

		await this.prisma.case.delete({
			where: { id },
		});
	}
}
