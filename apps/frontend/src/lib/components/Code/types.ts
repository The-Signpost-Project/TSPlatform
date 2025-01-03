import type { ReactNode, HTMLAttributes } from "react";
export interface CodeProps extends HTMLAttributes<HTMLElement> {
	className?: string;
	children: ReactNode;
}
