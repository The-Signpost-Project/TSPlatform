import type { InputHTMLAttributes, ReactNode } from "react";

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	variant?: "success" | "error";
	helperText?: string;
	className?: string;
	icon?: ReactNode;
	children?: ReactNode;
}
