"use client";
import { useRouter } from "next/navigation";
import type { PeddlerOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import {
	ModalCloseButton,
	Text,
	Title,
	Loader,
	List,
	Link,
	Button,
	KeyValue,
} from "@lib/components";
import { useEffect, useTransition, useState, useCallback } from "react";
import type { StrictPeddler } from "@shared/common/types";
import { fetchCase } from "./utils";
import { EditPeddler } from "../EditPeddler";
import { DeletePeddler } from "../DeletePeddler";
import { DownloadReport } from "./DownloadReport";

export function PeddlerOverlay({ routerAction, peddlerId }: PeddlerOverlayProps) {
	const router = useRouter();
	const navigate =
		routerAction === "back" ? router.back : () => router.replace("/peddlers", { scroll: false });
	useKeybinds({
		Escape: navigate,
	});
	const [isPending, startTransition] = useTransition();
	const [peddlerData, setPeddlerData] = useState<StrictPeddler | null>(null);
	const [error, setError] = useState<{ path: string; name: string; cause: string } | null>(null);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const revalidate = useCallback(
		(controller: AbortController) => {
			startTransition(async () => {
				const { data, error } = await fetchCase(peddlerId, controller.signal);

				startTransition(() => {
					if (error) {
						setError(error);
						return;
					}
					setError(null);
					setPeddlerData(data);
				});
			});
		},
		[peddlerId],
	);

	useEffect(() => {
		const controller = new AbortController();
		revalidate(controller);
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
				className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-11/12 absolute right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg "
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col p-4 gap-2 bg-white dark:bg-gray-900">
					<ModalCloseButton
						onClick={navigate}
						accessibilityLabel="peddler overlay"
						className="hover:dark:bg-gray-950"
					/>
					<div className="px-4 flex flex-col gap-4">
						{error && !isPending && (
							<div className="flex flex-col gap-6">
								<Title order={5}>Peddler {peddlerId}</Title>
								<Text>{error.name}</Text>
								<Text>Cause: {error.cause}</Text>
							</div>
						)}
						{isPending && <Loader />}

						{peddlerData && (
							<div className="flex flex-col gap-6">
								<Title order={5}>{peddlerData.codename}</Title>
								<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 items-start">
									<KeyValue label="Main Region">
										<Text>{peddlerData.mainRegion.name}</Text>
									</KeyValue>

									<KeyValue label="Last Name">
										<Text>{peddlerData.lastName}</Text>
									</KeyValue>
									<KeyValue label="First Name">
										<Text>{peddlerData.firstName ?? "???"}</Text>
									</KeyValue>
									<KeyValue label="Race">
										<Text>{peddlerData.race}</Text>
									</KeyValue>
									<KeyValue label="Sex">
										<Text>{peddlerData.sex === "M" ? "Male" : "Female"}</Text>
									</KeyValue>
									<KeyValue label="Birth Year">
										<Text>{peddlerData.birthYear}</Text>
									</KeyValue>
									<KeyValue label="Disabilities">
										{peddlerData.disabilities.length === 0 ? (
											<Text>No disabilities</Text>
										) : (
											<div className="flex flex-wrap gap-1"> 
												{peddlerData.disabilities.map((disability) => (
													<Text
														key={disability.id}
														className="bg-gray-200 dark:bg-gray-800 px-2 py-1.5 rounded"
                            order="xs"
													>
														{disability.name}
													</Text>
												))}
											</div>
										)}
									</KeyValue>
								</div>
							</div>
						)}
						{peddlerData && (
							<div className="flex flex-col gap-2">
								<div className="flex gap-2">
									<EditPeddler peddler={peddlerData} revalidate={revalidate} />
									<DeletePeddler
										id={peddlerData.id}
										codename={peddlerData.codename}
										navigateBack={() => {
											navigate();
											router.refresh();
										}}
									/>
								</div>
								<DownloadReport peddlerId={peddlerData.id} />
								<Button
									href={`/cases?peddlerCodename=${peddlerData.codename}`}
									className="w-full"
									variant="ghost"
								>
									View Cases
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
