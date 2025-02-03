"use client";
import { useTransition, useCallback } from "react";
import { downloadReport } from "./utils";
import { Button } from "@lib/components";
import toast from "react-hot-toast";
import type { DownloadReportProps } from "./types";

export function DownloadReport({ peddlerId }: DownloadReportProps) {
	const [isPending, startTransition] = useTransition();
	const downloadReportCb = useCallback(() => {
		startTransition(async () => {
			const { download, error } = await downloadReport(peddlerId);
			startTransition(() => {
				if (error) {
					toast.error(`Failed to download report: ${error.cause}`);
					return;
				}
				if (download) {
					download();
					toast.success("Report downloaded successfully");
				}
			});
		});
	}, [peddlerId]);

	return (
		<Button onClick={downloadReportCb} className="w-full" disabled={isPending}>
			Download Report
		</Button>
	);
}
