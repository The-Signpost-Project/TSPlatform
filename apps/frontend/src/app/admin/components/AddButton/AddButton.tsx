import type { AddButtonProps } from "./types";
import { Button } from "@lib/components";

export function AddButton({ subject, onClick }: AddButtonProps) {
	return (
		<Button
			onClick={onClick}
			type="button"
			className="flex items-center text-nowrap gap-2"
		>
			<svg
				className="w-4 h-4 text-gray-700/80 dark:text-gray-100/80"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					fillRule="evenodd"
					d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
					clipRule="evenodd"
				/>
			</svg>
			Add {subject}
		</Button>
	);
}
