"use client";
import { useRouter } from "next/navigation";
import type { CaseOverlayProps } from "./types";

export function CaseOverlay({ routerAction, caseId }: CaseOverlayProps) {
	const router = useRouter();
	return (
		<section
			className="fixed w-screen h-screen bg-gray-900 bg-opacity-50 z-50"
			onClick={() => (routerAction === "back" ? router.back() : router.replace("/cases"))}
		>
			<div
				className="w-1/2 absolute right-0 top-0 h-full bg-white"
				onClick={(e) => e.stopPropagation()}
			>
				{caseId}
			</div>
		</section>
	);
}
