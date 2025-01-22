"use client";
import { useState, useDeferredValue, useTransition, useEffect } from "react";
import type { CaseFilters as CaseFiltersOptions, StrictCase } from "@shared/common/types";
import { CaseGrid } from "../CaseGrid";
import { fetchCases, calculateLimitOffset, casesPerPage } from "./utils";
import { RadioRoot, RadioItem, Autocomplete, Pagination, Text, MultiSelect } from "@lib/components";
import type { CaseFiltersProps } from "./types";

//TODO: add team filter

export function CaseFilters({ allRegions, allPeddlers }: CaseFiltersProps) {
	const [filters, setFilters] = useState<CaseFiltersOptions>({
		...calculateLimitOffset(1),
		sortBy: "updatedAt",
		order: "desc",
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
				<div className="flex gap-4 w-full">
					<Autocomplete
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
					items={["1", "2", "3", "4", "5"]}
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
							importance: value.map((v) => parseInt(v) as 1 | 2 | 3 | 4 | 5),
						}));
					}}
					placeholder="Filter by Importance"
				/>

				<div className="flex gap-4 w-full">
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
							<RadioItem value="interactionDate">Date of interaction</RadioItem>
							<RadioItem value="importance">Importance</RadioItem>
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
							<RadioItem value="asc">Ascending</RadioItem>
							<RadioItem value="desc">Descending</RadioItem>
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
