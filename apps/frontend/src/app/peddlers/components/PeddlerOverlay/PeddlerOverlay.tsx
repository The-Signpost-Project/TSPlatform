"use client";
import { useRouter } from "next/navigation";
import type { PeddlerOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import { ModalCloseButton, Text, Title, Loader, List, Link, Button } from "@lib/components";
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
						{error && !isPending ? (
							<div className="flex flex-col gap-6">
								<Title order={5}>Peddler {peddlerId}</Title>
								<Text>{error.name}</Text>
								<Text>Cause: {error.cause}</Text>
							</div>
						) : (
							<>
								{isPending && <Loader />}
								{peddlerData && (
									<div className="flex flex-col gap-6">
										<Title order={5}>{peddlerData.codename}</Title>
										<div className="grid grid-cols-[1fr_2fr] gap-2">
											<Text className="font-semibold">Main Region:</Text>
											<Link href={`/cases?regionName=${peddlerData.mainRegion.name}`}>
												{peddlerData.mainRegion.name}
											</Link>
											<Text className="font-semibold">First Name:</Text>
											<Text>{peddlerData.firstName ?? "???"}</Text>
											<Text className="font-semibold">Last Name:</Text>
											<Text>{peddlerData.lastName}</Text>
											<Text className="font-semibold">Race:</Text>
											<Text>{peddlerData.race}</Text>
											<Text className="font-semibold">Sex:</Text>
											<Text>{peddlerData.sex === "M" ? "Male" : "Female"}</Text>
											<Text className="font-semibold">Birth Year:</Text>
											<Text>{peddlerData.birthYear}</Text>
											<Text className="font-semibold">Disabilities:</Text>
											{peddlerData.disabilities.length === 0 ? (
												<Text>No disabilities</Text>
											) : (
												<List.UnorderedList>
													{peddlerData.disabilities.map((disability) => (
														<List.ListItem
															key={disability.id}
															className="text-black dark:text-zinc-200"
														>
															{disability.name}
														</List.ListItem>
													))}
												</List.UnorderedList>
											)}
										</div>
										<div className="flex flex-col gap-2">
											<Button
												href={`/cases?peddlerCodename=${peddlerData.codename}`}
												className="w-full"
											>
												View Cases
											</Button>
											<DownloadReport peddlerId={peddlerData.id} />
											<div className="flex gap-2">
												<EditPeddler peddler={peddlerData} revalidate={revalidate} />
												<DeletePeddler
													id={peddlerData.id}
													codename={peddlerData.codename}
													navigateBack={() => {
                            navigate()
                            router.refresh();
                          }}
												/>
											</div>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
