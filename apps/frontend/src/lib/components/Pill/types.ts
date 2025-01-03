import type { ReactNode } from "react";

export type PillColor = "info" | "danger" | "warning" | "success";

export interface PillProps {
	children: ReactNode;
	className?: string;
	color?: PillColor;
}
