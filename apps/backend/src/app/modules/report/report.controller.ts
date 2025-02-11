import { Controller, Get, Res, Param, UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import { LoggedInGuard } from "@guards";
import type { Response } from "express";
import { ValidationPipe } from "@pipes";
import { NonEmptyStringSchema } from "@shared/common/schemas";

@Controller("report")
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get(":peddlerId")
	@UseGuards(LoggedInGuard)
	async getReport(
		@Res() res: Response,
		@Param("peddlerId", new ValidationPipe(NonEmptyStringSchema)) id: string,
	): Promise<void> {
		const doc = await this.reportService.generateReport(id);
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		);
		res.setHeader("Content-Disposition", `attachment; filename=${id}.docx`);

		res.end(doc);
	}
}
