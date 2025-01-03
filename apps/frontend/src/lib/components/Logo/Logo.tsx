import { Image } from "@lib/components";
import { twMerge } from "tailwind-merge";
import type { LogoProps } from "./types";

export function Logo(props: LogoProps) {
	return (
		<div {...props} className={twMerge("flex gap-1 h-6 w-full items-center", props.className)}>
			<div className="relative h-8 w-8">
				<Image src="/logo.svg" alt="Logo" />
			</div>
		</div>
	);
}
