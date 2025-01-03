import type { ButtonProps } from "./types";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { twButtonStyles, twDisabledButtonStyles, buttonRawColors } from "./constants";
import { Loader } from "@lib/components";
import { default as NextLink } from "next/link";

export function Button({
	children,
	className,
	color = "info",
	type = "button",
	disabled = false,
	loading = false,
	href,
	...rest
}: ButtonProps) {
	const isNotClickable = disabled || loading;
	const mergedStyles = twMerge(
		twButtonStyles[color],
		isNotClickable ? twDisabledButtonStyles : "",
		className,
	);

	const styledLoader = (
		<div className="flex w-10 h-4 items-center justify-center">
			<Loader color={buttonRawColors[color]} className="w-5" />
		</div>
	);

	const wrapWithLink = (element: ReactNode) => {
		return href ? (
			<NextLink href={href} tabIndex={-1}>
				{element}
			</NextLink>
		) : (
			element
		);
	};
	return wrapWithLink(
		<button type={type} className={mergedStyles} disabled={isNotClickable} {...rest}>
			{loading ? styledLoader : children}
		</button>,
	);
}
