import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { handleDatabaseError } from "@utils/prismaErrors";
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
		try {
			return await this.prisma.disability.create({ data });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getAll() {
		try {
			return await this.prisma.disability.findMany();
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getById(id: string) {
		try {
			const disability = await this.prisma.disability.findUnique({ where: { id } });
			if (!disability) {
				throw new AppError(AppErrorTypes.NotFound);
			}
			return disability;
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async updateById(id: string, data: UpdateDisabilityInput) {
		try {
			return await this.prisma.disability.update({ where: { id }, data });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async deleteById(id: string) {
		try {
			await this.prisma.disability.delete({ where: { id } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
