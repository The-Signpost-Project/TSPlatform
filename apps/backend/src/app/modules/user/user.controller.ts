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
} from "@nestjs/common";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@guards";
import { UserService } from "./user.service";
import { ValidationPipe } from "@pipes";
import {
	GetUserInputSchema,
	UpdateUserInputSchema,
	UpdateUserRolesInputSchema,
} from "@shared/common/schemas";
import type { UpdateUserInput } from "@shared/common/types";
import { RoleInterceptor, Roles } from "@interceptors";
import type { StrictRole } from "@shared/common/types";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { rolesHavePermission } from "@utils/rolesHavePermission";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("me")
	async user(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return await this.userService.getBySessionId(tokenId);
	}

	@Get()
	async getById(@Query("id", new ValidationPipe(GetUserInputSchema)) id: string) {
		return await this.userService.getById(id);
	}

	@Patch(":id")
	@UseGuards(AuthGuard("params", "id"))
	async updateById(
		@Param("id", new ValidationPipe(GetUserInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserInputSchema)) data: Omit<UpdateUserInput, "roles">,
	) {
		return await this.userService.updateById(id, data);
	}

	@Put(":id/role")
	@UseInterceptors(RoleInterceptor)
	async updateRole(
		@Param("id") id: string,
		@Body(new ValidationPipe(UpdateUserRolesInputSchema))
		data: Pick<UpdateUserInput, "roles">,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "allUsers", "readWrite", { id })) {
			return await this.userService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete(":id")
	@UseGuards(AuthGuard("params", "id"))
	async deleteById(@Param("id", new ValidationPipe(GetUserInputSchema)) id: string) {
		return await this.userService.deleteById(id);
	}

	@Get("all")
	@UseInterceptors(RoleInterceptor)
	async getAll(@Roles() roles: StrictRole[]) {
		// at the moment, only allow unconditional access if the role has a policy that allows all users and has no conditions
		if (
			roles.some((role) =>
				role.policies.some(
					(policy) => policy.resource === "allUsers" && policy.conditions.length === 0,
				),
			)
		) {
			return await this.userService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
