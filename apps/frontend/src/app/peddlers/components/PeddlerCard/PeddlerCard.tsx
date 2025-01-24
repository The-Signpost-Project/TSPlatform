"use client";
import type { PeddlerCardProps } from "./types";
import { Card, Text } from "@lib/components";
import { useRouter } from "next/navigation";

export function PeddlerCard({ data }: PeddlerCardProps) {
	const router = useRouter();
	return (
		<Card
			title={data.codename}
			description={data.id}
			className={"px-2 cursor-pointer"}
			descriptionClassName="break-all text-xs sm:text-xs"
			innerClassName="gap-2 px-2"
			onClick={() => router.push(`/cases/${data.id}`)}
		>
			<Text className="grid grid-cols-2 gap-2">
				<span className="font-semibold justify-start">First Name:</span>
				<span className="justify-self-start">{data.firstName ?? "???"}</span>

				<span className="font-semibold justify-self-start">Last Name:</span>
				<span className="justify-self-start">{data.lastName}</span>

				<span className="font-semibold justify-self-start">Main Region: </span>
				<span className="justify-self-start">{data.mainRegion.name}</span>
			</Text>
		</Card>
	);
}
