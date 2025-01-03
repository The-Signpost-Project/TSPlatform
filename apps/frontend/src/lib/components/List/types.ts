import type { ReactNode, HTMLAttributes } from "react";

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
	children: ReactNode;
}

export interface UnorderedListProps extends HTMLAttributes<HTMLUListElement> {
	children: ReactNode;
}

export interface OrderedListProps extends HTMLAttributes<HTMLOListElement> {
	children: ReactNode;
}
