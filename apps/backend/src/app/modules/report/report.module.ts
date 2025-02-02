import { Module } from "@nestjs/common";
import { DbClientModule } from "@db/client";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { PeddlerService } from "@modules/peddler";
import { CaseService } from "@modules/case";

@Module({
	imports: [DbClientModule],
	providers: [ReportService, CaseService, PeddlerService],
	controllers: [ReportController],
})
export class ReportModule {}
