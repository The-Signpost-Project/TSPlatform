import { Text } from "@lib/components";
import type { AutocompleteChoiceProps } from "./types";

export function AutocompleteChoice({ item, onSelect, isPending }: AutocompleteChoiceProps) {
	return (
		<button
			className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
			onClick={() => onSelect(item)}
			disabled={isPending}
			type="button"
		>
			<Text order="sm" className={isPending ? "text-gray-600 dark:text-gray-500" : ""}>
				{item}
			</Text>
		</button>
	);
}
