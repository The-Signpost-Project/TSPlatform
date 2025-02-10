import { Link } from "@lib/components";
import { twMerge } from "tailwind-merge";
import type { SidebarItemProps } from "./types";

export function SidebarItem({
	children,
	href,
	onClick,
	active = false,
	...props
}: SidebarItemProps) {
	return (
		<li
			{...props}
			className={twMerge(
				"text-gray-900 rounded-lg dark:text-white group",
				active ? "bg-orange-600/25" : "hover:bg-zinc-200 dark:hover:bg-zinc-700",
				props.className,
			)}
		>
			<Link unstyled href={href ? href : ""} onClick={onClick} className="flex items-center p-2">
				{children}
			</Link>
		</li>
	);
}
