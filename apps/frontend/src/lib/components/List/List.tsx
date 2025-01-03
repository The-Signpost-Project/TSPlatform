import type { ListItemProps, OrderedListProps, UnorderedListProps } from "./types";
import { twMerge } from "tailwind-merge";

const defaultListItemStyles = "text-zinc-600 dark:text-zinc-300";
const defaultUnorderedListStyles = "list-disc pl-4";
const defaultOrderedListStyles = "list-decimal pl-4";

export class List {
	static ListItem = ({ children, className, ...rest }: ListItemProps) => {
		const mergedStyles = twMerge(defaultListItemStyles, className);

		return (
			<li className={mergedStyles} {...rest}>
				{children}
			</li>
		);
	};
	static UnorderedList = ({ children, className, ...rest }: UnorderedListProps) => {
		const mergedStyles = twMerge(defaultUnorderedListStyles, className);

		return (
			<ul className={mergedStyles} {...rest}>
				{children}
			</ul>
		);
	};
	static OrderedList = ({ children, className, ...rest }: OrderedListProps) => {
		const mergedStyles = twMerge(defaultOrderedListStyles, className);

		return (
			<ol className={mergedStyles} {...rest}>
				{children}
			</ol>
		);
	};
}
