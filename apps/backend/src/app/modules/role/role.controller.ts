import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
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
} from "@shared/common/types";

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
	async getAll() {
		return await this.roleService.getAll();
	}

	@Get(":id")
	async getById(@Param("id", new ValidationPipe(GetRoleInputSchema)) id: string) {
		return await this.roleService.getById(id);
	}

	@Get("policies/all")
	async getAllPolicies() {
		return await this.policyService.getAll();
	}

	@Get("policies/:id")
	async getPolicyById(@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string) {
		return await this.policyService.getById(id);
	}

	@Post("policies")
	async createPolicy(@Body(new ValidationPipe(CreatePolicyInputSchema)) data: CreatePolicyInput) {
		return await this.policyService.create(data);
	}

	@Patch("policies/:id")
	async updatePolicyById(
		@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string,
		@Body(new ValidationPipe(UpdatePolicyInputSchema)) data: UpdatePolicyInput,
	) {
		return await this.policyService.updateById(id, data);
	}

	@Delete("policies/:id")
	async deletePolicyById(@Param("id", new ValidationPipe(GetPolicyInputSchema)) id: string) {
		return await this.policyService.deleteById(id);
	}
}
