import { Text } from "@lib/components";
import type { BooleanTextProps } from "./types";

export function BooleanText({ value }: BooleanTextProps) {
	if (value) {
		return <Text className="text-green-600 dark:text-green-400">Yes</Text>;
	}
	return <Text className="text-red-600 dark:text-red-400">No</Text>;
}
