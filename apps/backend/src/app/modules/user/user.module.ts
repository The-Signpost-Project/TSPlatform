import { Module } from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TeamService } from "./team.service";

@Module({
	providers: [UserService, PrismaService, LuciaService, TeamService],
	controllers: [UserController],
})
export class UserModule {}
