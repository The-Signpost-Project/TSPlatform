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
import { hasPermission } from "@shared/common/abac";

@Controller("role")
export class RoleController {
	constructor(
		private readonly roleService: RoleService,
		private readonly policyService: PolicyService,
	) {}

	@Post()
	async create(@Body(new ValidationPipe(CreateRoleInputSchema)) data: CreateRoleInput) {
		return await this.roleService.create(data);
	}

	@Patch(":id")
	async updateById(
		@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateRoleInputSchema)) data: UpdateRoleInput,
	) {
		return await this.roleService.updateById(id, data);
	}

	@Delete(":id")
	async deleteById(@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string) {
		return await this.roleService.deleteById(id);
	}

	@Get("all")
	@UseInterceptors(RoleInterceptor)
	async getAll(@Roles() roles: StrictRole[]) {
		if (
			roles.some((role) => role.policies.some((policy) => hasPermission(policy, "role", "read")))
		) {
			return await this.roleService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get(":id")
	@UseInterceptors(RoleInterceptor)
	async getById(
		@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (
			roles.some((role) =>
				role.policies.some((policy) => hasPermission(policy, "role", "read", { id })),
			)
		) {
			return await this.roleService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("policy/all")
	@UseInterceptors(RoleInterceptor)
	async getAllPolicies(@Roles() roles: StrictRole[]) {
		if (
			roles.some((role) => role.policies.some((policy) => hasPermission(policy, "policy", "read")))
		) {
			return await this.policyService.getAll();
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Get("policy/:id")
	@UseInterceptors(RoleInterceptor)
	async getPolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (
			roles.some((role) =>
				role.policies.some((policy) => hasPermission(policy, "policy", "read", { id })),
			)
		) {
			return await this.policyService.getById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Post("policy")
	@UseInterceptors(RoleInterceptor)
	async createPolicy(
		@Body(new ValidationPipe(CreatePolicyInputSchema)) data: CreatePolicyInput,
		@Roles() roles: StrictRole[],
	) {
		if (
			roles.some((role) =>
				role.policies.some((policy) => hasPermission(policy, "policy", "readWrite")),
			)
		) {
			return await this.policyService.create(data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Patch("policy/:id")
	@UseInterceptors(RoleInterceptor)
	async updatePolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Body(new ValidationPipe(UpdatePolicyInputSchema)) data: UpdatePolicyInput,
		@Roles() roles: StrictRole[],
	) {
		if (
			roles.some((role) =>
				role.policies.some((policy) => hasPermission(policy, "policy", "readWrite", { id })),
			)
		) {
			return await this.policyService.updateById(id, data);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}

	@Delete("policy/:id")
	@UseInterceptors(RoleInterceptor)
	async deletePolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Roles() roles: StrictRole[],
	) {
		if (
			roles.some((role) =>
				role.policies.some((policy) => hasPermission(policy, "policy", "readWrite", { id })),
			)
		) {
			return await this.policyService.deleteById(id);
		}
		throw new AppError(AppErrorTypes.NoPermission);
	}
}
