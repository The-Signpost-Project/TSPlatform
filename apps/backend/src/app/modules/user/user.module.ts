import { Module } from "@nestjs/common";
import { LuciaService, PrismaService, S3Service } from "@db/client";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TeamService } from "./team.service";

@Module({
	providers: [UserService, PrismaService, S3Service, LuciaService, TeamService],
	controllers: [UserController],
})
export class UserModule {}
