import { Text } from "@lib/components";
import type { KeyValueProps } from "./types";

export function KeyValue({ label, children }: KeyValueProps) {
	return (
		<div className="flex flex-col items-start gap-0.5 justify-center">
			<Text order="sm" description>
				{label}
			</Text>
			{children}
		</div>
	);
}
