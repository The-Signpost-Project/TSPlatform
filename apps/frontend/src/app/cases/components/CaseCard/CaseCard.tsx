import type { CaseCardProps } from "./types";
import { Card, Text, Button } from "@lib/components";
import { twMerge } from "tailwind-merge";
import { ImportanceText } from "../ImportanceText";

export function CaseCard({ data, isStale }: CaseCardProps) {
	return (
		<Card
			title={data.peddlerCodename}
			date={data.interactionDate.toLocaleDateString()}
			description={data.id}
			className={twMerge(isStale ? "animate-pulse" : "", "px-2 w-full")}
			descriptionClassName="break-all text-xs sm:text-xs"
			innerClassName="gap-2 px-2 flex flex-col justify-between h-full"
		>
			<Text className="grid grid-cols-2 gap-x-2 gap-y-1">
				<span className="font-medium justify-self-end">Updated At</span>
				<span className="justify-self-start">{data.updatedAt.toLocaleDateString()}</span>

				<span className="font-medium justify-self-end">Region</span>
				<span className="justify-self-start">{data.regionName}</span>

				<span className="font-medium justify-self-end">Importance</span>
				<span className="justify-self-start">
					<ImportanceText importance={data.importance} />
				</span>
			</Text>
			<Button href={`/cases/${data.id}`} className="w-full">
				View Details
			</Button>
		</Card>
	);
}
