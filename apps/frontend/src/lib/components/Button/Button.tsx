"use client";
import type { ButtonProps } from "./types";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
	twDisabledButtonStyles,
	buttonRawColors,
	twButtonBaseStyles,
	getTwButtonStyles,
} from "./constants";
import { Loader } from "@lib/components";
import { default as NextLink } from "next/link";
import { motion } from "motion/react";

export function Button({
	children,
	className,
	color = "info",
	type = "button",
	variant = "solid",
	icon,
	disabled = false,
	loading = false,
	href,
	...rest
}: ButtonProps) {
	const isNotClickable = disabled || loading;
	const mergedStyles = twMerge(
		twButtonBaseStyles,
		getTwButtonStyles(color, variant),
		isNotClickable ? twDisabledButtonStyles : "",
		className,
	);

	const styledLoader = (
		<div className="flex h-4 items-center justify-center w-full">
			<Loader color={variant === "solid" ? "white" : buttonRawColors[color]} className="w-5" />
		</div>
	);

	const wrapWithLink = (element: ReactNode) => {
		return href ? (
			<NextLink href={href} tabIndex={-1} className={mergedStyles}>
				{element}
			</NextLink>
		) : (
			element
		);
	};
	return wrapWithLink(
		<motion.button
			type={type}
			className={!href ? mergedStyles : undefined}
			disabled={isNotClickable}
			whileTap={{ scale: 0.98 }}
			{...rest}
		>
			{icon}
			{loading ? styledLoader : children}
		</motion.button>,
	);
}
