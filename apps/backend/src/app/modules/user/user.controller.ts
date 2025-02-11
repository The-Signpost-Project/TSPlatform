import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Put,
	Query,
	Req,
	UseInterceptors,
	Post,
	UploadedFile,
} from "@nestjs/common";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { UseGuards } from "@nestjs/common";
import { SelfServeGuard } from "@guards";
import { UserService } from "./user.service";
import { ValidationPipe } from "@pipes";
import {
	NonEmptyStringSchema,
	CreateTeamInputSchema,
	UpdateUserInputSchema,
	UpdateUserRolesInputSchema,
	UpdateTeamInputSchema,
	UserTeamInputSchema,
} from "@shared/common/schemas";
import type {
	CreateTeamInput,
	UpdateTeamInput,
	UpdateUserInput,
	UpdateUserRolesInput,
	UserTeamInput,
} from "@shared/common/types";
import { RestrictResourcesInterceptor } from "@interceptors";
import { TeamService } from "./team.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "@pipes";

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly teamService: TeamService,
	) {}

	@Get("me")
	async user(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return await this.userService.getBySessionId(tokenId);
	}

	@Get()
	async getById(@Query("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.userService.getById(id);
	}

	@Patch(":id")
	@UseGuards(SelfServeGuard("params", "id"))
	async updateById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserInputSchema)) data: UpdateUserInput,
	) {
		return await this.userService.updateById(id, data);
	}

	@Put(":id/role")

	@UseInterceptors(RestrictResourcesInterceptor("allUsers", "readWrite"))
	async updateRole(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserRolesInputSchema))
		data: UpdateUserRolesInput,
	) {
		return await this.userService.updateById(id, data);
	}

	@Delete(":id")
	@UseGuards(SelfServeGuard("params", "id"))
	async deleteById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.userService.deleteById(id);
	}

	@Get("all")
	@UseInterceptors(RestrictResourcesInterceptor("allUsers", "read"))
	async getAll() {
		// at the moment, only allow unconditional access if the role has a policy that allows all users and has no conditions

		return await this.userService.getAll();
	}

	@Post("team")
	@UseInterceptors(FileInterceptor("photo"))
	@UseInterceptors(RestrictResourcesInterceptor("team", "readWrite"))
	async createTeam(
		@Body(new ValidationPipe(CreateTeamInputSchema))
		data: CreateTeamInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File,
	) {
		return await this.teamService.create({ ...data, photo });
	}

	@Get("team/all")
	@UseInterceptors(RestrictResourcesInterceptor("team", "read"))
	async getAllTeams() {
		return await this.teamService.getAll();
	}

	@Post("team/:id/member")
	@UseInterceptors(RestrictResourcesInterceptor("team", "readWrite"))
	async addTeamMember(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UserTeamInputSchema)) data: UserTeamInput,
	) {
		return await this.teamService.addMember(id, data.userId);
	}

	@Delete("team/:id/member")
	@UseInterceptors(RestrictResourcesInterceptor("team", "readWrite"))
	async removeTeamMember(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UserTeamInputSchema)) data: UserTeamInput,
	) {
		return await this.teamService.deleteMember(id, data.userId);
	}

	@Get("team/:id")
	@UseInterceptors(RestrictResourcesInterceptor("team", "read"))
	async getTeam(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.teamService.getById(id);
	}

	@Patch("team/:id")
	@UseInterceptors(FileInterceptor("photo"))
	@UseInterceptors(RestrictResourcesInterceptor("team", "readWrite"))
	async updateTeam(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateTeamInputSchema)) data: Omit<UpdateTeamInput, "photo">,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File,
	) {
		return await this.teamService.updateById(id, { ...data, photo } satisfies UpdateTeamInput);
	}

	@Delete("team/:id")
	@UseInterceptors(RestrictResourcesInterceptor("team", "readWrite"))
	async deleteTeam(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.teamService.deleteById(id);
	}
}
