"use client";
import { useRouter } from "next/navigation";
import type { CaseOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import { ModalCloseButton } from "@lib/components";

export function CaseOverlay({ routerAction, caseId }: CaseOverlayProps) {
	const router = useRouter();
	const navigate = routerAction === "back" ? router.back : () => router.replace("/cases");
	useKeybinds({
		Escape: navigate,
	});
	return (
		<section
			className="fixed w-screen h-screen bg-gray-900 bg-opacity-50 z-50"
			onClick={navigate}
			onKeyDown={(e) => {
				if (e.key === "Escape") navigate();
			}}
		>
			<div
				className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-11/12 absolute right-0 top-0 h-full bg-white"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col p-3">
					<ModalCloseButton onClick={navigate} accessibilityLabel="case overlay" />
					<div className="px-4">Case ID: {caseId}</div>
				</div>
			</div>
		</section>
	);
}
