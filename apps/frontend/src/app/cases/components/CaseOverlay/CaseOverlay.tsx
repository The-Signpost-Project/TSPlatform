"use client";
import { useRouter } from "next/navigation";
import type { CaseOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import { ModalCloseButton, Text, Title, Loader, Image } from "@lib/components";
import { useEffect, useTransition, useState, useCallback } from "react";
import type { StrictCase, ErrorResponse } from "@shared/common/types";
import { fetchCase } from "./utils";
import { ImportanceText } from "../ImportanceText";
import { EditCase } from "../EditCase";

export function CaseOverlay({ routerAction, caseId }: CaseOverlayProps) {
	const router = useRouter();
	const navigate =
		routerAction === "back" ? router.back : () => router.replace("/cases", { scroll: false });
	useKeybinds({
		Escape: navigate,
	});
	const [isPending, startTransition] = useTransition();
	const [caseData, setCaseData] = useState<StrictCase | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const revalidate = useCallback(
		(signal: AbortSignal) => {
			startTransition(async () => {
				const { data, error } = await fetchCase(caseId, signal);

				if (error) {
					setError(error);
					return;
				}
				setError(null);
				setCaseData(data);
			});
		},
		[caseId],
	);

	useEffect(() => {
		const controller = new AbortController();
		revalidate(controller.signal);
		return () => controller.abort();
	}, [revalidate]);

	return (
		<section
			className="fixed w-screen h-svh top-0 bg-gray-900 bg-opacity-50 z-50 overflow-y-scroll"
			onClick={navigate}
			onKeyDown={(e) => {
				if (e.key === "Escape") navigate();
			}}
		>
			<div
				className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-11/12 absolute right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg "
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col p-4 gap-2 bg-white dark:bg-gray-900">
					<ModalCloseButton
						onClick={navigate}
						accessibilityLabel="case overlay"
						className="hover:dark:bg-gray-950"
					/>
					<div className="px-4 flex flex-col gap-4">
						<Title order={5}>Case {caseId}</Title>
						{error && !isPending ? (
							<div className="flex flex-col gap-6">
								<Text>{error.name}</Text>
								<Text>Cause: {error.cause}</Text>
							</div>
						) : (
							<>
								{isPending && <Loader />}
								{caseData && (
									<>
										<div className="flex flex-col gap-6">
											<div className="grid grid-cols-[1fr_2fr] gap-2">
												<Text className="font-semibold">Region: </Text>
												<Text>{caseData.regionName}</Text>
												<Text className="font-semibold">Specific Location: </Text>
												<Text>{caseData.location}</Text>
												<Text className="font-semibold">Peddler Codename: </Text>
												<Text>{caseData.peddlerCodename}</Text>
												<Text className="font-semibold">Interaction Date: </Text>
												<Text>{caseData.interactionDate.toLocaleDateString()}</Text>
												<Text className="font-semibold">Importance: </Text>
												<Text>
													<ImportanceText importance={caseData.importance} />
												</Text>
												<Text className="font-semibold">Notes: </Text>
												<Text className="break-words whitespace-pre-wrap">
													{caseData.notes || "No notes available."}
												</Text>
											</div>
											{caseData.photoPaths.length > 0 && (
												<div>
													<Text className="font-semibold">Photos:</Text>
													<div className="flex overflow-x-scroll gap-1">
														{caseData.photoPaths.map((photo) => (
															<div
																className="relative min-w-64 h-64 cursor-pointer"
																key={photo}
																onClick={() => window.open(photo)}
																onKeyDown={() => window.open(photo)}
															>
																<Image src={photo} alt="Case photo" />
															</div>
														))}
													</div>
												</div>
											)}
											<div className="grid grid-cols-[1fr_2fr] gap-2">
												<Text className="font-semibold">Created By: </Text>
												<Text>{caseData.createdByUsername}</Text>
												<Text className="font-semibold">Created At: </Text>
												<Text>{caseData.createdAt.toLocaleString()}</Text>
												<Text className="font-semibold">Updated At: </Text>
												<Text>{caseData.updatedAt.toLocaleString()}</Text>
												<Text className="font-semibold">First Interaction: </Text>
												<Text>{caseData.firstInteraction ? "Yes" : "No"}</Text>
											</div>
										</div>
										<div className="flex gap-2">
											<EditCase
												initialCase={caseData}
												revalidate={() => {
													const controller = new AbortController();
													revalidate(controller.signal);
												}}
											/>
										</div>
									</>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
