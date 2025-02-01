import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { CreateDisabilityInput, UpdateDisabilityInput } from "@shared/common/types";
import { CrudService } from "@base";
import type { Disability } from "@prisma/client";

@Injectable()
export class DisabilityService extends CrudService<Disability> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async create(data: CreateDisabilityInput) {
		if (!data.name) {
			throw new AppError(AppErrorTypes.EmptyInput);
		}
		return await this.prisma.disability.create({ data });
	}

	async getAll() {
		return await this.prisma.disability.findMany();
	}

	async getById(id: string) {
		const disability = await this.prisma.disability.findUnique({ where: { id } });
		if (!disability) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		return disability;
	}

	async updateById(id: string, data: UpdateDisabilityInput) {
		return await this.prisma.disability.update({ where: { id }, data });
	}

	async deleteById(id: string) {
		await this.prisma.disability.delete({ where: { id } });
	}
}
