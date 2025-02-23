import type { CaseGridProps } from "./types";
import { CaseCard } from "../CaseCard";
import { Loader } from "@lib/components";

export function CaseGrid({ cases, isStale }: CaseGridProps) {
	return (
		<>
			<div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 self-start justify-items-center">
				{cases.map((data) => (
					<CaseCard key={data.id} data={data} isStale={isStale} />
				))}
			</div>
			{isStale && <Loader />}
		</>
	);
}
