import type { ImportanceTextProps } from "./types";

export function ImportanceText({ importance }: ImportanceTextProps) {
	switch (importance) {
		case 1:
			return <span className="text-green-400">No concern (1)</span>;
		case 2:
			return <span className="text-green-500">No concern (2)</span>;
		case 3:
			return <span className="text-yellow-500">Mild concern (3)</span>;
		case 4:
			return <span className="text-orange-500">Concern (4)</span>;
		case 5:
			return <span className="text-red-500 font-bold">Urgent (5)</span>;
		default:
			return <span>Unknown</span>;
	}
}
