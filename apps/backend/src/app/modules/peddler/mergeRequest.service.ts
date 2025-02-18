import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import type {
	CreatePeddlerMergeRequestInput,
	PeddlerMergeRequest,
	UpdatePeddlerMergeRequestInput,
} from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CrudService } from "@base";

@Injectable()
export class MergeRequestService extends CrudService<PeddlerMergeRequest> {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	// Create a new merge request
	async create(data: CreatePeddlerMergeRequestInput): Promise<PeddlerMergeRequest> {
		const mergeRequest = await this.prisma.peddlerMergeRequest.create({
			data,
			include: {
				peddlerNew: true,
				peddlerOld: true,
				requestedBy: true,
			},
		});
		return mergeRequest as PeddlerMergeRequest;
	}

	// Get all merge requests with necessary relations
	async getAll(): Promise<PeddlerMergeRequest[]> {
		return (await this.prisma.peddlerMergeRequest.findMany({
			include: {
				peddlerNew: true,
				peddlerOld: true,
				requestedBy: true,
			},
		})) as PeddlerMergeRequest[];
	}

	async getById(id: string): Promise<PeddlerMergeRequest> {
		const mergeRequest = await this.prisma.peddlerMergeRequest.findUnique({
			where: { id },
			include: {
				peddlerNew: true,
				peddlerOld: true,
				requestedBy: true,
			},
		});
		if (!mergeRequest) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		return mergeRequest as PeddlerMergeRequest;
	}

	async updateById(id: string, data: UpdatePeddlerMergeRequestInput): Promise<PeddlerMergeRequest> {
		const updated = await this.prisma.peddlerMergeRequest.update({
			where: { id },
			data,
			include: {
				peddlerNew: true,
				peddlerOld: true,
				requestedBy: true,
			},
		});
		return updated as PeddlerMergeRequest;
	}

	// Delete a merge request record by id
	async deleteById(id: string): Promise<void> {
		await this.prisma.peddlerMergeRequest.delete({
			where: { id },
		});
	}
}
