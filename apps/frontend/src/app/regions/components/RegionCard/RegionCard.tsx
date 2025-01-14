import { Card } from "@lib/components";
import type { RegionCardProps } from "./types";

export function RegionCard({ region, className }: RegionCardProps) {
	return (
		<Card
			title={region.name}
			imgSrc={region.photoPath ?? "/common/empty-image.png"}
			className={className}
		/>
	);
}
