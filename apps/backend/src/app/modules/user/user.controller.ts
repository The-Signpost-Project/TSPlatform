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
import { RoleInterceptor, Roles } from "@interceptors";
import type { StrictRole } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { rolesHavePermission } from "@utils/rolesHavePermission";
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
	@UseInterceptors(RoleInterceptor)
	async updateRole(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserRolesInputSchema))
		data: UpdateUserRolesInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "allUsers", "readWrite", { id })) {
			return await this.userService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete(":id")
	@UseGuards(SelfServeGuard("params", "id"))
	async deleteById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.userService.deleteById(id);
	}

	@Get("all")
	@UseInterceptors(RoleInterceptor)
	async getAll(@Roles() roles: StrictRole[]) {
		// at the moment, only allow unconditional access if the role has a policy that allows all users and has no conditions
		if (rolesHavePermission(roles, "allUsers", "read")) {
			return await this.userService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("team")
	@UseInterceptors(RoleInterceptor)
	@UseInterceptors(FileInterceptor("photo"))
	async createTeam(
		@Body(new ValidationPipe(CreateTeamInputSchema))
		data: CreateTeamInput,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "readWrite")) {
			return await this.teamService.create({ ...data, photo } satisfies CreateTeamInput);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("team/all")
	@UseInterceptors(RoleInterceptor)
	async getAllTeams(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "team", "read")) {
			return await this.teamService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("team/:id/member")
	@UseInterceptors(RoleInterceptor)
	async addTeamMember(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UserTeamInputSchema)) data: UserTeamInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "readWrite")) {
			return await this.teamService.addMember(id, data.userId);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("team/:id/member")
	@UseInterceptors(RoleInterceptor)
	async removeTeamMember(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UserTeamInputSchema)) data: UserTeamInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "readWrite")) {
			return await this.teamService.deleteMember(id, data.userId);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("team/:id")
	@UseInterceptors(RoleInterceptor)
	async getTeam(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "read")) {
			return await this.teamService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch("team/:id")
	@UseInterceptors(RoleInterceptor)
	@UseInterceptors(FileInterceptor("photo"))
	async updateTeam(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateTeamInputSchema)) data: Omit<UpdateTeamInput, "photo">,
		@UploadedFile(new FileValidationPipe({ optional: true })) photo: Express.Multer.File,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "readWrite")) {
			return await this.teamService.updateById(id, { ...data, photo } satisfies UpdateTeamInput);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("team/:id")
	@UseInterceptors(RoleInterceptor)
	async deleteTeam(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "team", "readWrite")) {
			return await this.teamService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
