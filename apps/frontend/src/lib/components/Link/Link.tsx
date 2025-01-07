import type { LinkProps } from "./types";
import { twMerge } from "tailwind-merge";
import { default as NextLink } from "next/link";

const defaultStyles = `
text-orange-500 dark:text-orange-400 
underline sm:no-underline underline-offset-2
hover:sm:underline
hover:text-orange-600 dark:hover:text-orange-300 
focus:text-orange-600 dark:focus:text-orange-300 
active:text-orange-600 dark:active:text-orange-300
`;
export function Link({
	children,
	order = "base",
	className,
	href,
	external = false,
	unstyled = false,
	...rest
}: LinkProps) {
	const textSize = `text-${order}` as const;
	const mergedStyles = twMerge(unstyled ? "" : defaultStyles, textSize, className);

	return (
		<NextLink href={href} className={mergedStyles} {...rest}>
			{children}
			{external && " ⬈"}
		</NextLink>
	);
}
