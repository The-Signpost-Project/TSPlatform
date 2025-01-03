import type { ReactNode, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	date?: string;
	imgSrc?: string;
	title?: string;
	description?: string;
	className?: string;
}
