import type { CaseCardProps } from "./types";
import { Card } from "@lib/components";
import { Text } from "@lib/components";
import { twMerge } from "tailwind-merge";

export function CaseCard({ data, isStale }: CaseCardProps) {
	return (
		<Card
			title={data.peddlerCodename}
			date={data.interactionDate.toLocaleDateString()}
			description={data.id}
			className={twMerge(isStale ? "animate-pulse" : "", "px-4")}
			descriptionClassName="break-all text-xs sm:text-xs"
			innerClassName="gap-2"
		>
			<div className="flex flex-col items-start break-all">
				<Text>
					<span className="font-semibold">Created At: </span>
					{data.createdAt.toLocaleDateString()}
				</Text>
				<Text>
					<span className="font-semibold">Region: </span>
					{data.regionName}
				</Text>
				<Text>
					<span className="font-semibold">Importance: </span>
					{(() => {
						switch (data.importance) {
							case 1:
								return <span className="text-green-300">No concern (1)</span>;
							case 2:
								return <span className="text-green-500">No concern (2)</span>;
							case 3:
								return <span className="text-yellow-500">Mild concern (3)</span>;
							case 4:
								return <span className="text-orange-500">Concern (4)</span>;
							case 5:
								return <span className="text-red-500 font-bold">Urgent (5)</span>;
							default:
								return "Unknown";
						}
					})()}
				</Text>
			</div>
		</Card>
	);
}
