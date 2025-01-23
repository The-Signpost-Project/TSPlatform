"use client";
import type { CaseCardProps } from "./types";
import { Card, Text } from "@lib/components";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { ImportanceText } from "../ImportanceText";

export function CaseCard({ data, isStale }: CaseCardProps) {
	const router = useRouter();
	return (
		<Card
			title={data.peddlerCodename}
			date={data.interactionDate.toLocaleDateString()}
			description={data.id}
			className={twMerge(isStale ? "animate-pulse" : "", "px-2 cursor-pointer")}
			descriptionClassName="break-all text-xs sm:text-xs"
			innerClassName="gap-2 px-2"
			onClick={() => router.push(`/cases/${data.id}`)}
		>
			<Text className="grid grid-cols-2 gap-2">
				<span className="font-semibold justify-start">Created At: </span>
				<span className="justify-self-start">{data.createdAt.toLocaleDateString()}</span>

				<span className="font-semibold justify-self-start">Region: </span>
				<span className="justify-self-start">{data.regionName}</span>

				<span className="font-semibold justify-self-start">Importance: </span>
				<span className="justify-self-start">
					<ImportanceText importance={data.importance} />
				</span>
			</Text>
		</Card>
	);
}
