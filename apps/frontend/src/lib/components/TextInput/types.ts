import type { InputHTMLAttributes, ReactNode } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	variant?: "success" | "error";
	helperText?: string;
	className?: string;
	icon?: ReactNode;
	children?: ReactNode;
}
