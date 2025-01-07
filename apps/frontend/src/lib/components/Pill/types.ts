import type { HTMLAttributes, ReactNode } from "react";

export type PillColor = "info" | "danger" | "warning" | "success";

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	className?: string;
	color?: PillColor;
}
