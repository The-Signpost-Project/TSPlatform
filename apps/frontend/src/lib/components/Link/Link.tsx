import type { LinkProps } from "./types";
import { twMerge } from "tailwind-merge";
import { default as NextLink } from "next/link";

const defaultStyles = `
text-orange-500 dark:text-orange-400 
underline sm:no-underline underline-offset-2
hover:sm:underline
hover:text-orange-600 dark:hover:text-orange-300 
focus:text-orange-600 dark:focus:text-orange-300 
active:text-orange-600 dark:active:text-orange-300`;

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

export function Link({
	children,
	order = "base",
	className,
	href,
	external = false,
	unstyled = false,
	...rest
}: LinkProps) {
	const textSize = textSizeMapping[order] || "text-base";
	const mergedStyles = twMerge(unstyled ? "" : defaultStyles, textSize, className);

	return (
		<NextLink href={href} className={mergedStyles} {...rest}>
			<span className="inline-flex items-center gap-1">
				{children}
				{external && (
					<svg
						className="w-4 h-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
						/>
					</svg>
				)}
			</span>
		</NextLink>
	);
}
