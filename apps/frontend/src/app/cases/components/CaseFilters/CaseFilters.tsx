"use client";
import { useState, useDeferredValue, useTransition, useEffect } from "react";
import type { CaseFilters as CaseFiltersOptions, StrictCase } from "@shared/common/types";
import { CaseGrid } from "../CaseGrid";
import { fetchCases, calculateLimitOffset, casesPerPage } from "./utils";
import { RadioRoot, RadioItem, Autocomplete, Pagination, Text, MultiSelect } from "@lib/components";
import type { CaseFiltersProps } from "./types";
import { useSearchParams } from "next/navigation";

//TODO: add team filter

export function CaseFilters({ allRegions, allPeddlers }: CaseFiltersProps) {
	const params = useSearchParams();

	const [filters, setFilters] = useState<CaseFiltersOptions>(() => {
		const { limit, offset } = calculateLimitOffset(1);
		const sortBy = (
			["updatedAt", "interactionDate", "importance"].includes(params.get("sortBy") ?? "")
				? params.get("sortBy")
				: "updatedAt"
		) as "updatedAt" | "interactionDate" | "importance";
		const order = (
			["asc", "desc"].includes(params.get("order") ?? "") ? params.get("order") : "desc"
		) as "asc" | "desc";

		const peddlerCodename = params.get("peddlerCodename") ?? "";
		const regionName = params.get("regionName") ?? "";

		// find ids from names
		const peddlerId = allPeddlers.find((p) => p.codename === peddlerCodename)?.id;
		const regionId = allRegions.find((r) => r.name === regionName)?.id;

		const ret = {
			limit,
			offset,
			sortBy,
			order,
			peddlerId,
			regionId,
		};
    // biome-ignore lint/performance/noDelete: better to be explicit
		if (!peddlerId) delete ret.peddlerId;
    // biome-ignore lint/performance/noDelete: better to be explicit
		if (!regionId) delete ret.regionId;
		return ret;
	});
	const deferredFilters = useDeferredValue(filters);
	const [isPending, startTransition] = useTransition();
	const [filteredCases, setFilteredCases] = useState<StrictCase[]>([]);

	const isStale = deferredFilters !== filters || isPending;

	useEffect(() => {
		const controller = new AbortController();
		startTransition(async () => {
			const { data } = await fetchCases(deferredFilters, controller.signal);
			setFilteredCases(data);
		});
		return () => controller.abort();
	}, [deferredFilters]);

	return (
		<div className="flex flex-col gap-4 w-full items-center">
			<div className="flex flex-col gap-4 w-full">
				<div className="flex gap-4 w-full sm:flex-row flex-col">
					<Autocomplete
						value={allPeddlers.find((p) => p.id === filters.peddlerId)?.codename ?? ""}
						items={allPeddlers.reduce((acc, region) => {
							acc.push(region.codename);
							return acc;
						}, [] as string[])}
						label="Filter by Peddler Codename"
						handleChange={(val) => {
							const peddler = allPeddlers.find((r) => r.codename === val);
							if (peddler) {
								setFilters((prev) => ({ ...prev, peddlerId: peddler.id }));
							}
						}}
						placeholder="eg. AMK_Lim_M"
						className="md:w-1/2"
						onClickOutside={() =>
							setFilters((prev) => {
								// remove regionId from filters
								const { peddlerId, ...rest } = prev;
								return rest;
							})
						}
					/>
					<Autocomplete
						value={allRegions.find((r) => r.id === filters.regionId)?.name ?? ""}
						items={allRegions.reduce((acc, region) => {
							acc.push(region.name);
							return acc;
						}, [] as string[])}
						label="Filter by Region"
						handleChange={(val) => {
							const region = allRegions.find((r) => r.name === val);
							if (region) {
								setFilters((prev) => ({ ...prev, regionId: region.id }));
							}
						}}
						placeholder="eg. Bishan"
						className="md:w-1/2"
						onClickOutside={() =>
							setFilters((prev) => {
								// remove regionId from filters
								const { regionId, ...rest } = prev;
								return rest;
							})
						}
					/>
				</div>

				<MultiSelect
					items={[
						"No concern (1)",
						"No concern (2)",
						"Mild concern (3)",
						"Concern (4)",
						"Urgent (5)",
					]}
					onChange={(value) => {
						if (value.length === 0) {
							// remove importance from filters
							setFilters((prev) => {
								const { importance, ...rest } = prev;
								return rest;
							});
							return;
						}
						setFilters((prev) => ({
							...prev,
							// remove all non-numeric characters from the string
							// and parse the string to an integer
							importance: value
								.map((v) => v.replace(/[^0-9]/g, ""))
								.map((v) => Number.parseInt(v) as 1 | 2 | 3 | 4 | 5),
						}));
					}}
					label="Filter by Importance"
				/>

				<div className="flex gap-4 w-full sm:flex-row flex-col">
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Sort By
						</Text>
						<RadioRoot
							onValueChange={(v) =>
								setFilters((prev) => ({
									...prev,
									sortBy: v as "updatedAt" | "interactionDate" | "importance",
								}))
							}
							required
							className="flex gap-2 flex-col"
							value={filters.sortBy}
						>
							<RadioItem value="updatedAt">Updated At</RadioItem>
							<RadioItem value="importance">Importance</RadioItem>
							<RadioItem value="interactionDate">Date of interaction</RadioItem>
						</RadioRoot>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Order
						</Text>
						<RadioRoot
							onValueChange={(v) =>
								setFilters((prev) => ({
									...prev,
									order: v as "asc" | "desc",
								}))
							}
							required
							className="flex gap-2 flex-col"
							value={filters.order}
						>
							<RadioItem value="desc">Descending</RadioItem>
							<RadioItem value="asc">Ascending</RadioItem>
						</RadioRoot>
					</div>
				</div>
			</div>
			<CaseGrid cases={filteredCases} isStale={isStale} />
			<Pagination
				disableNext={filteredCases.length < casesPerPage}
				disablePrevious={deferredFilters.offset === 0}
				onClickNext={() =>
					setFilters((prev) => ({
						...prev,
						limit: casesPerPage,
						offset: (prev.offset ?? 0) + casesPerPage,
					}))
				}
				onClickPrevious={() =>
					setFilters((prev) => ({
						...prev,
						limit: casesPerPage,
						offset: (prev.offset ?? 0) - casesPerPage,
					}))
				}
				labels={["Previous Page", "Next Page"]}
			/>
		</div>
	);
}
