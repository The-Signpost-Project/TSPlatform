import type { ReactNode } from "react";
import type { StrictPolicy } from "@shared/common/types";

export type CollapsibleRowProps = {
	data: ReactNode;
	children: ReactNode;
};
export type PolicyTableProps = {
	policies: StrictPolicy[];
};
