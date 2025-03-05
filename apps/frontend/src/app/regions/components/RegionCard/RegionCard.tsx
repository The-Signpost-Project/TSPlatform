import { Button, Card } from "@lib/components";
import type { RegionCardProps } from "./types";
import { EditRegion } from "../EditRegion";
import { DeleteRegion } from "../DeleteRegion";

export function RegionCard({ region, className }: RegionCardProps) {
	return (
		<Card
			title={region.name}
			imgSrc={region.photoPath ?? "/common/empty-image.png"}
			className={className}
			innerClassName="flex flex-col gap-2 px-4"
		>
			<div className="flex gap-2 w-full">
				<EditRegion region={region} />
				<DeleteRegion region={region} />
			</div>
			<Button href={`/cases?regionName=${region.name}`} className="w-full" variant="ghost">
				View Cases
			</Button>
		</Card>
	);
}
