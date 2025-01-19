"use client";
import { useForm } from "react-hook-form";
import type { CaseFormProps, CaseFormValues } from "./types";
import { CombinedCaseFormSchema } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DateInput,
	TextInput,
	TextArea,
	Autocomplete,
	MultiSelect,
	FileDrop,
	Button,
	Text,
} from "@lib/components";
import { useTransition, useState } from "react";
import { supportedFileTypes } from "@shared/common/constants";

export function CaseForm({ allRegions, allDisabilities }: CaseFormProps) {
	const { register, handleSubmit, formState, watch, setValue } = useForm<CaseFormValues>({
		resolver: zodResolver(CombinedCaseFormSchema),
	});
	const showNewPeddlerSection = watch("firstInteraction");

	const [isPending, startTransition] = useTransition();
	const [photos, setPhotos] = useState<FileList | null>(null);

	const onSubmit = (data: CaseFormValues) => {
		console.log(data);
	};

	return (
		<form
			onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
			className="w-full flex flex-col gap-4"
		>
			<DateInput
				label="Date of Interaction"
				onChange={(date) => setValue("interactionDate", date)}
				containerClassName="sm:w-64"
				disabled={isPending}
				variant={formState.errors.interactionDate ? "error" : undefined}
				helperText={formState.errors.interactionDate?.message as string}
			/>
			<Autocomplete
				items={allRegions.reduce((acc, region) => {
					acc.push(region.name);
					return acc;
				}, [] as string[])}
				label="Region"
				handleChange={(val) => {
					const region = allRegions.find((r) => r.name === val);
					if (region) {
						setValue("regionId", region.id);
					}
				}}
				placeholder="Select the region this peddler was located in."
				disabled={isPending}
				variant={formState.errors.regionId ? "error" : undefined}
				helperText={formState.errors.regionId?.message as string}
				className="md:w-1/2"
			/>
			<div className="md:w-1/2 flex flex-col gap-1">
				<Text description order="sm">
					Photo of Peddler/Location
				</Text>
				<FileDrop
					onChange={(e) => setPhotos(e.target.files)}
					disabled={isPending}
					accept={supportedFileTypes}
				/>
			</div>
		</form>
	);
}
