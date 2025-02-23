import type { PeddlerCardProps } from "./types";
import { Card, Text, Button } from "@lib/components";

export function PeddlerCard({ data }: PeddlerCardProps) {
	return (
		<Card
			title={data.codename}
			description={data.id}
			className="px-2"
			descriptionClassName="break-all text-xs sm:text-xs"
			innerClassName="gap-2 px-2 flex flex-col justify-between h-full"
		>
			<Text className="grid grid-cols-2 gap-2">
				<span className="font-semibold justify-start">First Name:</span>
				<span className="justify-self-start">{data.firstName ?? "???"}</span>

				<span className="font-semibold justify-self-start">Last Name:</span>
				<span className="justify-self-start">{data.lastName}</span>

				<span className="font-semibold justify-self-start">Main Region: </span>
				<span className="justify-self-start">{data.mainRegion.name}</span>
			</Text>
			<Button href={`/peddlers/${data.id}`} className="w-full">
				View Peddler details
			</Button>
		</Card>
	);
}
