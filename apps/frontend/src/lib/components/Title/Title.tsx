import type { TitleProps } from "./types";
import { defaultStyles, twTitleTextSizing } from "./constants";
import { twMerge } from "tailwind-merge";

export function Title({ children, order = 1, className, ...rest }: TitleProps) {
	const Tag = `h${order}` as const;
	const mergedStyles = twMerge("font-semibold", defaultStyles, twTitleTextSizing[order], className);
	return (
		<Tag className={mergedStyles} {...rest}>
			{children}
		</Tag>
	);
}
