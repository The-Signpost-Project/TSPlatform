import { Injectable } from "@nestjs/common";
import { PrismaService, S3Service } from "@db/client";
import type { Team, CreateTeamInput, UpdateTeamInput } from "@shared/common/types";
import { CrudService } from "@base";
import { UserService } from "./user.service";
import type { Prisma } from "@prisma/client";
import { AppError, AppErrorTypes } from "@/utils/appErrors";

@Injectable()
export class TeamService extends CrudService<Team> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly s3: S3Service,
	) {
		super();
	}

	async create(input: CreateTeamInput) {
		const { photo, ...rest } = input;

		let photoPath: string | null = null;
		if (photo) {
			photoPath = await this.s3.upload(photo, {
				dir: "team",
				contentType: photo.mimetype,
			});
		}

		const raw = await this.prisma.team.create({
			data: {
				...rest,
				photoPath,
				// members are added later
			} satisfies Prisma.TeamCreateInput,
			include: {
				members: {
					select: {
						user: {
							select: UserService.rawUserFindFields,
						},
					},
				},
			},
		});

		const computed = {
			...raw,
			photoPath: raw.photoPath ? await this.s3.getUrl(raw.photoPath) : null,
			members: raw.members.map((member) => this.userService.cleanUserData(member.user)),
		} satisfies Team;
		return computed;
	}

	async getById(id: string) {
		const raw = await this.prisma.team.findUnique({
			where: { id },
			include: {
				members: {
					select: {
						user: {
							select: UserService.rawUserFindFields,
						},
					},
				},
			},
		});
		if (!raw) {
			throw new AppError(AppErrorTypes.NotFound);
		}
		const computed = {
			...raw,
			members: raw.members.map((member) => this.userService.cleanUserData(member.user)),
			photoPath: raw.photoPath ? await this.s3.getUrl(raw.photoPath) : null,
		} satisfies Team;
		return computed;
	}

	async updateById(id: string, data: UpdateTeamInput) {
		const team = await this.getById(id);

		const { photo, ...rest } = data;
		if (photo) {
			if (team.photoPath) {
				await this.s3.remove(team.photoPath);
			}
			team.photoPath = await this.s3.upload(photo, {
				dir: "team",
				contentType: photo.mimetype,
			});
		}
		const raw = await this.prisma.team.update({
			where: { id },
			data: {
				...rest,
				photoPath: team.photoPath,
			} satisfies Prisma.TeamUpdateInput,
			include: {
				members: {
					select: {
						user: {
							select: UserService.rawUserFindFields,
						},
					},
				},
			},
		});
		const computed = {
			...raw,
			members: raw.members.map((member) => this.userService.cleanUserData(member.user)),
			photoPath: raw.photoPath ? await this.s3.getUrl(raw.photoPath) : null,
		} satisfies Team;
		return computed;
	}

	async deleteById(id: string) {
		const team = await this.getById(id);
		if (team.photoPath) {
			await this.s3.remove(team.photoPath);
		}
		await this.prisma.team.delete({
			where: { id },
		});
	}

	async getAll() {
		const raw = await this.prisma.team.findMany({
			include: {
				members: {
					select: {
						user: {
							select: UserService.rawUserFindFields,
						},
					},
				},
			},
		});

		const computed = Promise.all(
			raw.map(
				async (team) =>
					({
						...team,
						members: team.members.map((member) => this.userService.cleanUserData(member.user)),
						photoPath: team.photoPath ? await this.s3.getUrl(team.photoPath) : null,
					}) satisfies Team,
			),
		);

		return computed;
	}

	async addMember(teamId: string, userId: string) {
		await this.prisma.userTeam.create({
			data: {
				user: {
					connect: {
						id: userId,
					},
				},
				team: {
					connect: {
						id: teamId,
					},
				},
			} satisfies Prisma.UserTeamCreateInput,
		});
	}

	async deleteMember(teamId: string, userId: string) {
		await this.prisma.userTeam.deleteMany({
			where: {
				userId,
				teamId,
			},
		});
	}
}
