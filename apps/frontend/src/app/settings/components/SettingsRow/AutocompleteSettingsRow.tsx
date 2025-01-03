"use client";
import { useState, useTransition, useEffect } from "react";
import type { AutocompleteSettingsRowProps } from "./types";
import { Text, Autocomplete } from "@lib/components";

export function AutocompleteSettingsRow({
	fieldKey,
	label,
	value,
	items,
	onSubmit,
}: AutocompleteSettingsRowProps) {
	const [search, setSearch] = useState(value ?? "");
	const [isPending, startTransition] = useTransition();

	// Side effect to submit whenever search changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: search is the only dependency
	useEffect(() => {
		if (search !== value) {
			handleSubmit(search);
		}
	}, [search]);

	const handleSubmit = (newValue: string) => {
		startTransition(async () => {
			await onSubmit({ [fieldKey]: newValue });
		});
	};

	return (
		<div className="flex gap-4 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>
			<div className="flex items-center gap-2">
				<Autocomplete
					items={items}
					handleChange={(value) => setSearch(value)}
					value={search}
					placeholder={`Enter ${label}`}
					disabled={isPending}
				/>
			</div>
		</div>
	);
}
