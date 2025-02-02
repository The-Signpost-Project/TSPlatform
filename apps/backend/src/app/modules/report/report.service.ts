import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { CaseService } from "@modules/case";
import { PeddlerService } from "@modules/peddler";
import { ReportData } from "./types";
import createReport from "docx-templates";
import { Templater } from "@base";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { supportedFileTypes } from "@shared/common/constants";

@Injectable()
export class ReportService extends Templater {
	constructor(
		private readonly prisma: PrismaService,
		private readonly caseService: CaseService,
		private readonly peddlerService: PeddlerService,
	) {
		super();
	}

	private getCaseTemplate = () => readFileSync(join(this.publicDir, "report", "caseReport.docx"));

	private async pullData(id: string): Promise<ReportData> {
		const results = await Promise.allSettled([
			this.caseService.getFiltered({ peddlerId: id }),
			this.peddlerService.getById(id),
		]);
		if (results[0].status === "rejected") {
			throw new AppError(AppErrorTypes.GenericError(`Failed to fetch cases: ${results[0].reason}`));
		}
		if (results[1].status === "rejected") {
			throw new AppError(
				AppErrorTypes.GenericError(`Failed to fetch peddler: ${results[1].reason}`),
			);
		}
		const cases = results[0].status === "fulfilled" ? results[0].value : null;
		const peddler = results[1].status === "fulfilled" ? results[1].value : null;
		if (!cases || !peddler) {
			throw new AppError(AppErrorTypes.GenericError("Failed to fetch data"));
		}
		return { cases, peddler };
	}

	async generateReport(id: string): Promise<Buffer> {
		const { cases, peddler } = await this.pullData(id);

		try {
			const report = await createReport({
				template: this.getCaseTemplate(),
				data: {
					peddler,
					cases: cases.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
					timeGenerated: new Date().toLocaleString("en-GB", { timeZone: "Asia/Singapore" }),
				},
				cmdDelimiter: ["{# ", " #}"],
				additionalJsContext: {
					image: async (url: string) => {
						let buffer: Buffer;
						let extension: string;
						try {
							const response = await fetch(url);
							if (!response.ok) {
								throw new Error(`Failed to fetch image: ${response.statusText}`);
							}

							const arrBuffer = await response.arrayBuffer();

							buffer = Buffer.from(arrBuffer);

							const contentType = response.headers.get("content-type");
							if (!contentType || !supportedFileTypes.includes(contentType)) {
								throw new Error(`Invalid content type: ${contentType}`);
							}
							extension = contentType.split("/")[1];
						} catch (e) {
							console.error(`Failed to fetch image: ${e}`);
							buffer = readFileSync(join(this.publicDir, "report", "static", "image-icon.png"));
							extension = "png";
						}
						return {
							height: 6,
							width: 6,
							data: buffer,
							extension: `.${extension}`,
						};
					},
				},
				failFast: false,
			});
			return Buffer.from(report);
		} catch (e) {
			if (Array.isArray(e)) {
				// An array of errors likely caused by bad commands in the template.
				const templateErrors = e.filter((error) => error instanceof Error);
				if (templateErrors.length > 0) {
					// At least one error in the array, indicating a problem with the template.
					throw new AppError(
						AppErrorTypes.GenericError(
							`Failed to generate report: ${templateErrors.map((error) => error.message).join(", ")}`,
						),
					);
				}
			} else {
				// Not an array of template errors, indicating something more serious.
				throw new AppError(AppErrorTypes.GenericError("Failed to generate report"));
			}
		}
		throw new AppError(AppErrorTypes.GenericError("Failed to generate report"));
	}
}
