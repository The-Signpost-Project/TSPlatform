import type { SidebarItemProps, SidebarProps } from "./types";
import { twMerge } from "tailwind-merge";
import { Link } from "@lib/components";

export function Sidebar({ children, ...props }: SidebarProps) {
	return (
		<aside
			{...props}
			id="default-sidebar"
			className={twMerge(
				"w-24 min-w-24 sm:min-w-48 sm:w-48 block overflow-auto transition-transform sm:translate-x-0",
				props.className,
			)}
			aria-label="Sidebar"
		>
			<div className="h-full px-3 py-4 overflow-y-auto bg-zinc-100 dark:bg-zinc-900 border-r-2 border-gray-300 dark:border-zinc-800">
				<ul>{children}</ul>
			</div>
		</aside>
	);
}

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
				"p-2 text-gray-900 rounded-lg dark:text-white group",
				active ? "bg-orange-600/25" : "hover:bg-zinc-200 dark:hover:bg-zinc-700",
				props.className,
			)}
		>
			<Link unstyled href={href ? href : ""} onClick={onClick} className="flex items-center">
				{children}
			</Link>
		</li>
	);
}
