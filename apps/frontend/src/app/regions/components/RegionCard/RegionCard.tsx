import { Button, Card } from "@lib/components";
import type { RegionCardProps } from "./types";

export function RegionCard({ region, className }: RegionCardProps) {
	return (
		<Card
			title={region.name}
			imgSrc={region.photoPath ?? "/common/empty-image.png"}
			className={className}
			innerClassName="flex flex-col gap-2"
		>
			<Button href={`/cases?regionName=${region.name}`} className="w-full">
				View Cases
			</Button>
		</Card>
	);
}
