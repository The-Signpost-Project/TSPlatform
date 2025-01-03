import type { ReactNode } from "react";

export type GaugeColor = "info" | "danger" | "warning" | "success";

export interface GaugeProps {
	children?: ReactNode;
	progress: number; // 0-100
	className?: string;
	color?: GaugeColor;
}
