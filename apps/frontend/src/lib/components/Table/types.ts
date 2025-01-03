import type { ReactNode, HTMLAttributes } from "react";

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
	children: ReactNode;
	className?: string;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableCellElement> {
	children: ReactNode;
	className?: string;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	children: ReactNode;
	className?: string;
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
	children: ReactNode;
	className?: string;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
	children: ReactNode;
	className?: string;
}

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
	children: ReactNode;
	className?: string;
}
