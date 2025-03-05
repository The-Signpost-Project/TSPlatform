import type { TextProps } from "./types";
import { twMerge } from "tailwind-merge";

const defaultStyles = "text-black dark:text-zinc-200";
const descriptionStyles = "text-gray-600 dark:text-gray-400";

const textSizeMapping: Record<string, string> = {
	xs: "text-xs",
	base: "text-base",
	sm: "text-sm",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
	"4xl": "text-4xl",
	"5xl": "text-5xl",
	"6xl": "text-6xl",
	"7xl": "text-7xl",
	"8xl": "text-8xl",
	"9xl": "text-9xl",
};

export function Text({
	children,
	order = "base",
	className,
	description = false,
	...rest
}: TextProps) {
	const textSize = textSizeMapping[order] || "text-base";
	const mergedStyles = twMerge(
		description ? descriptionStyles : defaultStyles,
		textSize,
		className,
	);
	return (
		<p className={mergedStyles} {...rest}>
			{children}
		</p>
	);
}
