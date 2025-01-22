import type { CaseGridProps } from "./types";
import { CaseCard } from "../CaseCard";

export function CaseGrid({ cases, isStale }: CaseGridProps) {
	return (
		<div className="grid grid-cols-5 gap-2">
			{cases.map((data) => (
				<CaseCard key={data.id} data={data} isStale={isStale} />
			))}
		</div>
	);
}
