"use client";
import { use } from "react";
import type { CaseGridProps } from "./types";

export function CaseGrid({ cases, isStale }: CaseGridProps) {
	return (
		<div>
			{JSON.stringify(cases)}
			{"am i stale?" + isStale}
		</div>
	);
}
