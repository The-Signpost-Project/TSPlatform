import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { PolicyService } from "./policy.service";
import { ValidationPipe } from "@pipes";
import {
	CreatePolicyInputSchema,
	CreateRoleInputSchema,
	NonEmptyStringSchema,
	UpdatePolicyInputSchema,
	UpdateRoleInputSchema,
} from "@shared/common/schemas";
import type {
	CreatePolicyInput,
	CreateRoleInput,
	UpdatePolicyInput,
	UpdateRoleInput,
} from "@shared/common/types";
import { RestrictResourcesInterceptor } from "@interceptors";

@Controller("role")
export class RoleController {
	constructor(
		private readonly roleService: RoleService,
		private readonly policyService: PolicyService,
	) {}

	@Post()
	@UseInterceptors(RestrictResourcesInterceptor("role", "readWrite"))
	async create(@Body(new ValidationPipe(CreateRoleInputSchema)) data: CreateRoleInput) {
		return await this.roleService.create(data);
	}

	@Patch(":id")
	@UseInterceptors(RestrictResourcesInterceptor("role", "readWrite"))
	async updateById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdateRoleInputSchema)) data: UpdateRoleInput,
	) {
		return await this.roleService.updateById(id, data);
	}

	@Delete(":id")
	@UseInterceptors(RestrictResourcesInterceptor("role", "readWrite"))
	async deleteById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.roleService.deleteById(id);
	}

	@Get("all")
	@UseInterceptors(RestrictResourcesInterceptor("role", "read"))
	async getAll() {
		return await this.roleService.getAll();
	}

	@Get(":id")
	@UseInterceptors(RestrictResourcesInterceptor("role", "read"))
	async getById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.roleService.getById(id);
	}

	@Get("policy/all")
	@UseInterceptors(RestrictResourcesInterceptor("policy", "read"))
	async getAllPolicies() {
		return await this.policyService.getAll();
	}

	@Get("policy/:id")
	@UseInterceptors(RestrictResourcesInterceptor("policy", "read"))
	async getPolicyById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.policyService.getById(id);
	}

	@Post("policy")
	@UseInterceptors(RestrictResourcesInterceptor("policy", "readWrite"))
	async createPolicy(@Body(new ValidationPipe(CreatePolicyInputSchema)) data: CreatePolicyInput) {
		return await this.policyService.create(data);
	}

	@Patch("policy/:id")
	@UseInterceptors(RestrictResourcesInterceptor("policy", "readWrite"))
	async updatePolicyById(
		@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string,
		@Body(new ValidationPipe(UpdatePolicyInputSchema)) data: UpdatePolicyInput,
	) {
		return await this.policyService.updateById(id, data);
	}

	@Delete("policy/:id")
	@UseInterceptors(RestrictResourcesInterceptor("policy", "readWrite"))
	async deletePolicyById(@Param("id", new ValidationPipe(NonEmptyStringSchema)) id: string) {
		return await this.policyService.deleteById(id);
	}
}
