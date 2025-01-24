"use client";
import { Card } from "@lib/components";
import type { RegionCardProps } from "./types";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function RegionCard({ region, className }: RegionCardProps) {
	const router = useRouter();
	const handleClick = () => {
		router.push(`/cases?regionName=${region.name}`);
	};

	return (
		<Card
			onClick={handleClick}
			title={region.name}
			imgSrc={region.photoPath ?? "/common/empty-image.png"}
			className={twMerge("cursor-pointer", className)}
		/>
	);
}
