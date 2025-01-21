"use client";
import { useState, useDeferredValue, useTransition, useEffect } from "react";
import type { CaseFilters, StrictCase } from "@shared/common/types";
import { CaseGrid } from "../CaseGrid";
import { fetchCases } from "./utils";
import { RadioRoot, RadioItem, Autocomplete } from "@lib/components";
import type { CaseFiltersProps } from "./types";

//TODO: add team filter

const casesPerPage = 10;
export function CaseFilters({ allRegions, allPeddlers }: CaseFiltersProps) {
	const [filters, setFilters] = useState<CaseFilters>({});
	const deferredFilters = useDeferredValue(filters, {});
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
		<div>
			<div>
				<Autocomplete
					items={allRegions.reduce((acc, region) => {
						acc.push(region.name);
						return acc;
					}, [] as string[])}
					label="Region"
					handleChange={(val) => {
						console.log(val);
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
			<CaseGrid cases={filteredCases} isStale={isStale} />
		</div>
	);
}
