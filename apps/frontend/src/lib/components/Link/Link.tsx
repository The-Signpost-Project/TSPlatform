import type { LinkProps } from "./types";
import { twMerge } from "tailwind-merge";
import { default as NextLink } from "next/link";

const defaultStyles = `
text-teal-500 dark:text-teal-400 
visited:text-violet-700 dark:visited:text-violet-500 
underline sm:no-underline underline-offset-2
hover:sm:underline
hover:text-teal-600 dark:hover:text-teal-300 
hover:visited:text-violet-800 dark:hover:visited:text-violet-600
focus:text-teal-600 dark:focus:text-teal-300 
focus:visited:text-violet-800 dark:focus:visited:text-violet-600
active:text-teal-600 dark:active:text-teal-300
active:visited:text-violet-800 dark:active:visited:text-violet-600
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
