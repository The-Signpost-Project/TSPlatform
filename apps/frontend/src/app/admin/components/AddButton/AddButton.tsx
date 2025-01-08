import type { AddButtonProps } from "./types";
import { Text } from "@lib/components";

export function AddButton({ subject, onClick }: AddButtonProps) {
	return (
		<button
			onClick={onClick}
			type="button"
			className="flex items-center space-x-2 p-2 rounded-md bg-gray-200 dark:bg-gray-800 h-12 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
		>
			<svg
				className="w-6 h-6 text-gray-800 dark:text-gray-200"
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
			<Text className="text-nowrap">Add {subject}</Text>
		</button>
	);
}
