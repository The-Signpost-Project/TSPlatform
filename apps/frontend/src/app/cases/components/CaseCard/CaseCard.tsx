"use client";
import type { CaseCardProps } from "./types";
import { Card, Text } from "@lib/components";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

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
				</span>
			</Text>
		</Card>
	);
}
