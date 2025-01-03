import { Module } from "@nestjs/common";
import { OpenAuthService } from "./oauth.service";
import { OpenAuthController } from "./oauth.controller";
import { DbClientModule, LuciaService, PrismaService } from "@db/client";

@Module({
	imports: [DbClientModule],
	controllers: [OpenAuthController],
	providers: [OpenAuthService, LuciaService, PrismaService],
})
export class OpenAuthModule {}
