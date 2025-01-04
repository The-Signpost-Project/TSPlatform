import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import type { CreatePeddlerInput, StrictPeddler, UpdatePeddlerInput } from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CrudService } from "@base";
import type { Prisma, Peddler, PeddlerDisability } from "@prisma/client";
import { DisabilityService } from "./disability.service";

@Injectable()
export class PeddlerService extends CrudService<StrictPeddler> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly disabilityService: DisabilityService,
	) {
		super();
	}

	private cleanPeddlerData(
		data: Prisma.PeddlerGetPayload<{
			include: { disabilities: { include: { disability: true } } };
		}>,
	): StrictPeddler {
		return {
			...(data as Omit<StrictPeddler, "disabilities">),
			disabilities: data.disabilities.map((d) => ({ id: d.id, name: d.disability.name })),
		};
	}

	async create(data: CreatePeddlerInput): Promise<StrictPeddler> {
		// region_lastname_sex
		const codename = `${data.mainRegion}_${data.lastName}_${data.sex}`;

		const { disabilities, ...peddlerData } = data;
		try {
			const newPeddler = await this.prisma.peddler.create({ data: { ...peddlerData, codename } });
			// create peddlerdisability records
			const peddlerDisability = data.disabilities.map((d) => ({
				disabilityId: d.id,
				peddlerId: newPeddler.id,
			}));
			await this.prisma.peddlerDisability.createMany({ data: peddlerDisability });

			return this.getById(newPeddler.id);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			const res = await this.prisma.peddler.findMany({
				include: { disabilities: { include: { disability: true } } },
			});
			return res.map(this.cleanPeddlerData);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const peddler = await this.prisma.peddler.findUnique({
				where: { id },
				include: { disabilities: { include: { disability: true } } },
			});
			if (!peddler) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return this.cleanPeddlerData(peddler);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdatePeddlerInput) {
		try {
			const peddler = await this.prisma.peddler.findUnique({ where: { id } });
			if (!peddler) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			const { disabilities, ...peddlerData } = data;
			const updatedPeddler = await this.prisma.peddler.update({
				where: { id },
				data: peddlerData,
			});
			// update peddlerdisability records
			const peddlerDisability = data.disabilities?.map((d) => ({
				disabilityId: d.id,
				peddlerId: updatedPeddler.id,
			}));
			await this.prisma.peddlerDisability.deleteMany({ where: { peddlerId: id } });
			if (peddlerDisability) {
				await this.prisma.peddlerDisability.createMany({ data: peddlerDisability });
			}

			return this.getById(updatedPeddler.id);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			await this.prisma.peddler.delete({ where: { id } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
