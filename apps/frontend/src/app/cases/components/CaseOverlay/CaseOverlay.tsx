"use client";
import { useRouter } from "next/navigation";
import type { CaseOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import { ModalCloseButton, Text, Title, Loader, Image, KeyValue } from "@lib/components";
import { useEffect, useTransition, useState, useCallback } from "react";
import type { StrictCase, ErrorResponse } from "@shared/common/types";
import { fetchCase } from "./utils";
import { ImportanceText } from "../ImportanceText";
import { EditCase } from "../EditCase";
import { DeleteCase } from "../DeleteCase";

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
			className="fixed w-screen h-svh top-0 bg-gray-900/40 backdrop-blur-sm z-50 overflow-y-scroll"
			onClick={navigate}
			onKeyDown={(e) => {
				if (e.key === "Escape") navigate();
			}}
		>
			<div
				className="lg:w-2/3 sm:w-5/6 w-11/12 absolute right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg "
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
						<Title order={4}>Case {caseId}</Title>
						{isPending && <Loader />}
						{error && !isPending && (
							<div className="flex flex-col gap-6">
								<Text>{error.name}</Text>
								<Text>Cause: {error.cause}</Text>
							</div>
						)}
						{/* 4 column grid layout */}
						{caseData && (
							<div className="flex flex-col gap-2">
								<div>
									<Text className="font-semibold mb-1" order="lg">
										Details
									</Text>
									<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 items-start">
										<KeyValue label="Codename">
											<Text>{caseData.peddlerCodename}</Text>
										</KeyValue>
										<KeyValue label="Importance">
											<Text>
												<ImportanceText importance={caseData.importance} />
											</Text>
										</KeyValue>
										<KeyValue label="Region">
											<Text>{caseData.regionName}</Text>
										</KeyValue>
										<KeyValue label="Specific Location">
											<Text>{caseData.location}</Text>
										</KeyValue>

										<KeyValue label="Interaction Date">
											<Text>{caseData.interactionDate.toLocaleDateString()}</Text>
										</KeyValue>
									</div>
								</div>

								<div>
									<Text className="font-semibold mb-1" order="lg">
										Notes
									</Text>
									<Text className="break-words whitespace-pre-wrap" order="sm">
										{caseData.notes ?? "No notes provided."}
									</Text>
								</div>
								{caseData.photoPaths.length > 0 && (
									<div>
										<Text className="font-semibold mb-1" order="lg">
											Photos
										</Text>
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
								<div>
									<Text className="font-semibold mb-1" order="lg">
										Metadata
									</Text>
									<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 items-start">
										<KeyValue label="Created By">
											<Text>{caseData.createdByUsername}</Text>
										</KeyValue>
										<KeyValue label="Created At">
											<Text>{caseData.createdAt.toLocaleString()}</Text>
										</KeyValue>
										<KeyValue label="Updated At">
											<Text>{caseData.updatedAt.toLocaleString()}</Text>
										</KeyValue>
										<KeyValue label="First Interaction">
											<Text>{caseData.firstInteraction ? "Yes" : "No"}</Text>
										</KeyValue>
									</div>
								</div>
							</div>
						)}

						{caseData && (
							<div className="flex gap-2">
								<EditCase
									initialCase={caseData}
									revalidate={() => {
										const controller = new AbortController();
										revalidate(controller.signal);
									}}
								/>
								<DeleteCase
									id={caseId}
									navigateBack={() => {
										navigate();
										router.refresh();
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
