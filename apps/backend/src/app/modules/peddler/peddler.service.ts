import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import type { CreatePeddlerInput, StrictPeddler, UpdatePeddlerInput } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CrudService } from "@base";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PeddlerService extends CrudService<StrictPeddler> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	private cleanPeddlerData(
		data: Prisma.PeddlerGetPayload<{
			include: { disabilities: { include: { disability: true } }; mainRegion: true };
		}>,
	): StrictPeddler {
		return {
			...(data as Omit<StrictPeddler, "disabilities" | "mainRegion">),
			mainRegion: { id: data.mainRegion.id, name: data.mainRegion.name },
			disabilities: data.disabilities.map((d) => ({ id: d.id, name: d.disability.name })),
		};
	}

	async create(data: CreatePeddlerInput): Promise<StrictPeddler> {
		let mainRegion: { id: string; name: string; photoPath: string | null } | undefined = undefined;

		// get mainRegion
		mainRegion =
			(await this.prisma.region.findUnique({ where: { id: data.mainRegionId } })) ?? undefined;
		if (!mainRegion) {
			throw new AppError(AppErrorTypes.FormValidationError("Main region not found"));
		}

		// region_lastname_sex
		const codename = `${mainRegion.name}_${data.lastName}_${data.sex}`;

		const { disabilityIds, ...peddlerData } = data;

		const newPeddler = await this.prisma.peddler.create({
			data: { codename, ...peddlerData },
		});
		// create peddlerdisability records
		const peddlerDisability = disabilityIds.map((d) => ({
			disabilityId: d,
			peddlerId: newPeddler.id,
		}));
		await this.prisma.peddlerDisability.createMany({ data: peddlerDisability });

		return this.getById(newPeddler.id);
	}

	async getAll() {
		const res = await this.prisma.peddler.findMany({
			include: { disabilities: { include: { disability: true } }, mainRegion: true },
		});
		return res.map(this.cleanPeddlerData);
	}

	async getById(id: string) {
		const peddler = await this.prisma.peddler.findUnique({
			where: { id },
			include: { disabilities: { include: { disability: true } }, mainRegion: true },
		});
		if (!peddler) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		return this.cleanPeddlerData(peddler);
	}

	async updateById(id: string, data: UpdatePeddlerInput) {
		const peddler = await this.prisma.peddler.findUnique({
			where: { id },
			include: { mainRegion: true },
		});
		if (!peddler) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		let mainRegion:
			| {
					id: string;
					name: string;
					photoPath: string | null;
			  }
			| undefined = undefined;

		// get mainRegion
		if (data.mainRegionId) {
			mainRegion =
				(await this.prisma.region.findUnique({ where: { id: data.mainRegionId } })) ?? undefined;
		}

		if (data.mainRegionId && mainRegion === undefined) {
			throw new AppError(AppErrorTypes.FormValidationError("Main region not found"));
		}

		let codename = peddler.codename;
		// if changes to peddler lastName or sex or mainRegionId
		if (data.lastName !== undefined || data.sex !== undefined || data.mainRegionId !== undefined) {
			// calculate new codename
			codename = `${mainRegion?.name ?? peddler.mainRegion.name}_${data.lastName ?? peddler.lastName}_${data.sex ?? peddler.sex}`;
		}

		const { disabilityIds, ...peddlerData } = data;
		const updatedPeddler = await this.prisma.peddler.update({
			where: { id },
			data: { codename, ...peddlerData },
		});
		// update peddlerdisability records
		const peddlerDisability = disabilityIds?.map((d) => ({
			disabilityId: d,
			peddlerId: updatedPeddler.id,
		}));
		await this.prisma.peddlerDisability.deleteMany({ where: { peddlerId: id } });
		if (peddlerDisability) {
			await this.prisma.peddlerDisability.createMany({ data: peddlerDisability });
		}

		return this.getById(updatedPeddler.id);
	}

	async deleteById(id: string) {
		await this.prisma.peddler.delete({ where: { id } });
	}
}
