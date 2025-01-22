import type { CaseCardProps } from "./types";
import { Card } from "@lib/components";

export function CaseCard({ data, isStale }: CaseCardProps) {
	return (
		<Card
			title={data.peddlerCodename}
			date={data.createdAt.toLocaleDateString()}
			description={data.id}
			className={isStale ? "opacity-60" : ""}
			descriptionClassName="break-all"
		/>
	);
}
