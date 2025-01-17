import { Module } from "@nestjs/common";
import { DbClientModule } from "@db/client";
import { CaseController } from "./case.controller";
import { CaseService } from "./case.service";

@Module({
	imports: [DbClientModule],
	providers: [CaseService],
	controllers: [CaseController],
})
export class CaseModule {}
