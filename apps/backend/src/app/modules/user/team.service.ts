import { Injectable } from "@nestjs/common";
import { PrismaService, S3Service } from "@db/client";
import type { Team, CreateTeamInput, } from "@shared/common/types";
import { CrudService } from "@base";
import { UserService } from "./user.service";
import type { Prisma } from "@prisma/client";

@Injectable()
// @ts-expect-error
export class TeamService extends CrudService<Team> {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly s3: S3Service,
	) {
		super();
	}

	async create(input: CreateTeamInput) {
		let photoPath: string | null = null;
		if (input.photo) {
			photoPath = await this.s3.upload(input.photo, {
				dir: "case-photos",
				contentType: input.photo.mimetype,
			});
		}

		const raw = await this.prisma.team.create({
			data: {
				...input,
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
			members: raw.members
				.map((member) => member.user)
				.map((member) => ({
					...this.userService.cleanUserData(member),
				})),
		} satisfies Team;
		return computed;
	}
}
