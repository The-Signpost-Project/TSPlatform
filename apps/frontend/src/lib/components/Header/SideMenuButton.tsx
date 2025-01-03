import type { SideMenuButtonProps } from "./types";
import { Image, Text } from "@lib/components";
import { twMerge } from "tailwind-merge";

export function SideMenuButton({ text, icon, onClick, imageClassname }: SideMenuButtonProps) {
	return (
		<button
			type="button"
			className="flex gap-3 items-center px-4 py-2 hover:dark:bg-gray-700  hover:bg-gray-100 rounded-lg w-full"
			onClick={onClick}
		>
			<Image
				src={icon}
				className={twMerge("dark:invert", imageClassname)}
				alt="menu"
				height={20}
				width={20}
			/>
			<Text order="sm">{text}</Text>
		</button>
	);
}
