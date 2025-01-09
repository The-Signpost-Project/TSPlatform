import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { PolicyService } from "./policy.service";
import { ValidationPipe } from "@pipes";
import {
	CreatePolicyInputSchema,
	CreateRoleInputSchema,
	GetPolicyInputSchema,
	GetRoleInputSchema,
	UpdatePolicyInputSchema,
	UpdateRoleInputSchema,
} from "@shared/common/schemas";
import type {
	CreatePolicyInput,
	CreateRoleInput,
	UpdatePolicyInput,
	UpdateRoleInput,
	StrictRole,
} from "@shared/common/types";
import { RoleInterceptor, Roles } from "@interceptors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { rolesHavePermission } from "@utils/rolesHavePermission";

@Controller("role")
@UseInterceptors(RoleInterceptor)
export class RoleController {
	constructor(
		private readonly roleService: RoleService,
		private readonly policyService: PolicyService,
	) {}

	@Post()
	async create(
		@Body(new ValidationPipe(CreateRoleInputSchema)) data: CreateRoleInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "role", "readWrite")) {
			return await this.roleService.create(data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch(":id")
	async updateById(
		@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateRoleInputSchema)) data: UpdateRoleInput,
	) {
		return await this.roleService.updateById(id, data);
	}

	@Delete(":id")
	async deleteById(
		@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "role", "readWrite", { id })) {
			return await this.roleService.deleteById(id);
		}
	}

	@Get("all")
	async getAll(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "role", "read")) {
			return await this.roleService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get(":id")
	async getById(
		@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "role", "read", { id })) {
			return await this.roleService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("policy/all")
	async getAllPolicies(@Roles() roles: StrictRole[]) {
		if (rolesHavePermission(roles, "policy", "read")) {
			return await this.policyService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("policy/:id")
	async getPolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "policy", "read", { id })) {
			return await this.policyService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("policy")
	async createPolicy(
		@Body(new ValidationPipe(CreatePolicyInputSchema)) data: CreatePolicyInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "policy", "readWrite")) {
			return await this.policyService.create(data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch("policy/:id")
	async updatePolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Body(new ValidationPipe(UpdatePolicyInputSchema)) data: UpdatePolicyInput,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "policy", "readWrite", { id })) {
			return await this.policyService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("policy/:id")
	async deletePolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (rolesHavePermission(roles, "policy", "readWrite", { id })) {
			return await this.policyService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
