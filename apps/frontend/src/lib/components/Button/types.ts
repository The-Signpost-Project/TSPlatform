import type { ReactNode, HTMLAttributes } from "react";

export type ButtonColor = "info" | "danger" | "warning" | "success";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	href?: string;
	className?: string;
	type?: "button" | "submit" | "reset";
	color?: ButtonColor;
	disabled?: boolean;
	loading?: boolean;
}
