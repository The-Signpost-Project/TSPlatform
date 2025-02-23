import type { ImportanceTextProps } from "./types";
import { twMerge } from "tailwind-merge";

export function ImportanceText({ importance }: ImportanceTextProps) {
	const renderSeverity = (color: string, label: string) => (
		<span>
			<span className={twMerge("inline-block w-2.5 h-2.5 mr-1 rounded-full", color)} />
			{label}
		</span>
	);
	switch (importance) {
		case 1:
			return renderSeverity("bg-green-400", "No concern (1)");
		case 2:
			return renderSeverity("bg-green-500", "No concern (2)");
		case 3:
			return renderSeverity("bg-yellow-500", "Mild concern (3)");
		case 4:
			return renderSeverity("bg-orange-500", "Concern (4)");
		case 5:
			return renderSeverity("bg-red-500", "Urgent (5)");
		default:
			return <span>Unknown</span>;
	}
}
