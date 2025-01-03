import { Module } from "@nestjs/common";
import { PrismaService, DbClientModule } from "@db/client";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";

@Module({
	imports: [DbClientModule],
	providers: [EmailService, PrismaService],
	controllers: [EmailController],
})
export class EmailModule {}
