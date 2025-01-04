"use client";
import { Image } from "@lib/components";
import { twMerge } from "tailwind-merge";
import type { LogoProps } from "./types";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";

export function Logo(props: LogoProps) {
	const { theme } = useContext(ClientContext);

	return (
		<div className={twMerge("relative w-16 h-16", props.className)} {...props}>
			{theme === "dark" ? (
				<Image src="/logo-dark.png" alt="Logo" />
			) : (
				<Image src="/logo.png" alt="Logo" />
			)}
		</div>
	);
}
