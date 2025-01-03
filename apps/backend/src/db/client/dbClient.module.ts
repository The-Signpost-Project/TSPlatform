import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { LuciaService } from "./lucia.service";

@Module({
	providers: [PrismaService, LuciaService],
	exports: [PrismaService, LuciaService],
})
export class DbClientModule {}
