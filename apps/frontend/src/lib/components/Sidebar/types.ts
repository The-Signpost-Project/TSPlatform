import type { HTMLAttributes, ReactNode } from "react";
export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SidebarItemProps extends HTMLAttributes<HTMLLIElement> {
	children: ReactNode;
	active?: boolean;
	href?: string;
	onClick?: () => void;
}
