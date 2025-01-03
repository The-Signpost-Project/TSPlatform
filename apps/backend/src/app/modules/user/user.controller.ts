import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@guards";
import { UserService } from "./user.service";
import { ValidationPipe } from "@pipes";
import { GetUserInputSchema, UpdateUserInputSchema } from "@shared/common/schemas";
import type { UpdateUserInput } from "@shared/common/types";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("me")
	async user(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return await this.userService.getUserBySessionId(tokenId);
	}

	@Get()
	async getUserById(@Query("id", new ValidationPipe(GetUserInputSchema)) id: string) {
		return await this.userService.getUserById(id);
	}

	@Patch(":id")
	@UseGuards(AuthGuard("params", "id"))
	async updateUserById(
		@Param("id", new ValidationPipe(GetUserInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserInputSchema)) data: UpdateUserInput,
	) {
		return await this.userService.updateUserById(id, data);
	}

	@Delete(":id")
	@UseGuards(AuthGuard("params", "id"))
	async deleteUserById(@Param("id", new ValidationPipe(GetUserInputSchema)) id: string) {
		return await this.userService.deleteUserById(id);
	}
}
