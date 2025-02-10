import type { SidebarProps } from "./types";
import { twMerge } from "tailwind-merge";

export function Sidebar({ children, ...props }: SidebarProps) {
	return (
		<aside
			{...props}
			id="default-sidebar"
			className={twMerge(
				"w-16 min-w-16 sm:min-w-48 sm:w-48 block overflow-auto transition-transform sm:translate-x-0",
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
