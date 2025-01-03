import type {
	TableCellProps,
	TableRowProps,
	TableProps,
	TableHeadProps,
	TableHeaderProps,
	TableBodyProps,
} from "./types";
import { twMerge } from "tailwind-merge";

const defaultTableCellStyles =
	"px-4 py-2 border-2 dark:border-gray-700 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
const defaultTableHeaderStyles =
	"px-4 py-2 border bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
const defaultTableRowStyles = "border-2 dark:border-gray-700";
const defaultTableStyles = "w-full table-auto dark:bg-gray-950";

export class Table {
	static TableCell = ({ children, className, ...rest }: TableCellProps) => {
		const mergedStyles = twMerge(defaultTableCellStyles, className);

		return (
			<td className={mergedStyles} {...rest}>
				{children}
			</td>
		);
	};
	static TableHeader = ({ children, className, ...rest }: TableHeaderProps) => {
		const mergedStyles = twMerge(defaultTableHeaderStyles, className);

		return (
			<th className={mergedStyles} {...rest}>
				{children}
			</th>
		);
	};
	static TableRow = ({ children, className, ...rest }: TableRowProps) => {
		const mergedStyles = twMerge(defaultTableRowStyles, className);

		return (
			<tr className={mergedStyles} {...rest}>
				{children}
			</tr>
		);
	};
	static TableHead = ({ children, className, ...rest }: TableHeadProps) => {
		return (
			<thead className={className} {...rest}>
				{children}
			</thead>
		);
	};
	static TableBody = ({ children, className, ...rest }: TableBodyProps) => {
		return (
			<tbody className={className} {...rest}>
				{children}
			</tbody>
		);
	};
	static Table = ({ children, className, ...rest }: TableProps) => {
		const mergedStyles = twMerge(defaultTableStyles, className);

		return (
			<table className={mergedStyles} {...rest}>
				{children}
			</table>
		);
	};
}
