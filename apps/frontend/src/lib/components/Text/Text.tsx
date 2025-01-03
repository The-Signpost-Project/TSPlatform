import type { TextProps } from "./types";
import { twMerge } from "tailwind-merge";

const defaultStyles = "text-black dark:text-zinc-200";

export function Text({ children, order = "base", className, ...rest }: TextProps) {
	const textSize = `text-${order}` as const;
	const mergedStyles = twMerge(defaultStyles, textSize, className);
	return (
		<p className={mergedStyles} {...rest}>
			{children}
		</p>
	);
}
