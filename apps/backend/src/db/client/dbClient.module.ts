import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { LuciaService } from "./lucia.service";
import { S3Service } from "./s3.service";

@Module({
	providers: [PrismaService, LuciaService, S3Service],
	exports: [PrismaService, LuciaService, S3Service],
})
export class DbClientModule {}
