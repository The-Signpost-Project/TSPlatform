import { Controller, Get, UseInterceptors, Res, Param } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";
import { ReportService } from "./report.service";
import { RoleInterceptor } from "@interceptors";
import type { Response } from "express";
import { ValidationPipe } from "@pipes";
import { NonEmptyStringSchema } from "@shared/common/schemas";

@Controller("report")
@UseInterceptors(RoleInterceptor)
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get(":peddlerId")
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
