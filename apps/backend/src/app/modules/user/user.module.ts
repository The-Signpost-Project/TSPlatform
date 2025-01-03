import { Module } from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
	providers: [UserService, PrismaService, LuciaService],
	controllers: [UserController],
})
export class UserModule {}
