"use client";
import { use } from "react";
import type { CaseGridProps } from "./types";

export function CaseGrid({ data }: CaseGridProps) {
	const awaitedData = use(data);
	return <div>{JSON.stringify(awaitedData)}</div>;
}
