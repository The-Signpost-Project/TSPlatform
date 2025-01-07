import type { PillProps } from "./types";
import { twMerge } from "tailwind-merge";
import { twPillStyles } from "./constants";

export function Pill({ children, className, color = "info", ...props }: PillProps) {
	const mergedStyles = twMerge(twPillStyles[color], className);
	return (
		<span className={mergedStyles} {...props}>
			{children}
		</span>
	);
}
