import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";

export type ButtonColor = "info" | "danger" | "warning" | "success";

export type ButtonVariant = "solid" | "outlined" | "ghost";

export interface ButtonProps extends HTMLMotionProps<"button"> {
	children: ReactNode;
	href?: string;
	className?: string;
	type?: "button" | "submit" | "reset";
	color?: ButtonColor;
	disabled?: boolean;
	loading?: boolean;
	variant?: ButtonVariant;
	icon?: ReactNode;
}
