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
	RadioRoot,
	RadioItem,
	Title,
} from "@lib/components";
import { useTransition, useState, useEffect } from "react";
import { supportedFileTypes } from "@shared/common/constants";
import { AnimatePresence, motion } from "motion/react";

export function CaseForm({ allRegions, allDisabilities, allPeddlers }: CaseFormProps) {
	const { register, handleSubmit, formState, watch, setValue } = useForm<CaseFormValues>({
		resolver: zodResolver(CombinedCaseFormSchema),
		defaultValues: {
			interactionDate: new Date(),
			disabilityIds: [] as string[],
			firstInteraction: true,
		},
	});
	const [showNewPeddlerSection, setShowNewPeddlerSection] = useState(true);
	useEffect(() => {
		const subscriber = watch((value) => {
			setShowNewPeddlerSection(value.firstInteraction ?? true);
		});
		return () => {
			subscriber.unsubscribe();
		};
	}, [watch]);

	const [isPending, startTransition] = useTransition();
	const [photos, setPhotos] = useState<FileList | null>(null);

	const onSubmit = (data: CaseFormValues) => {
		console.log(data, photos);
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
				placeholder="eg. Bishan"
				disabled={isPending}
				variant={formState.errors.regionId ? "error" : undefined}
				helperText={formState.errors.regionId?.message as string}
				className="md:w-1/2"
			/>
			<TextInput
				label="Specific Location of Individual"
				placeholder="eg. Clementi Blk 42 (Under void deck) / 7-11 at MRT"
				disabled={isPending}
				{...register("location")}
				variant={formState.errors.location ? "error" : undefined}
				helperText={formState.errors.location?.message as string}
				className="md:w-4/5"
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

			<TextArea
				label="Notes and Details"
				placeholder="eg. Auntie XXX seemed to be unhappy today..."
				disabled={isPending}
				{...register("notes")}
				variant={formState.errors.notes ? "error" : undefined}
				helperText={formState.errors.notes?.message as string}
				className="md:w-4/5"
			/>
			<div className="flex flex-col gap-2">
				<Text description order="sm">
					How Important is this case?
				</Text>
				<div>
					<Text order="xs" description>
						1 is least urgent, 5 is most urgent (will be pm'ed to EXCO).
					</Text>
					<Text order="xs" description>
						Indicating 4 or 5 will flag the case to EXCO during the next meeting.
					</Text>
				</div>

				<RadioRoot
					onValueChange={(v) => setValue("importance", Number(v) as 1 | 2 | 3 | 4 | 5)}
					required
					className="flex gap-4"
				>
					<RadioItem value="1">1</RadioItem>
					<RadioItem value="2">2</RadioItem>
					<RadioItem value="3">3</RadioItem>
					<RadioItem value="4">4</RadioItem>
					<RadioItem value="5">5</RadioItem>
				</RadioRoot>
				<Text order="sm" className="text-red-500 dark:text-red-400">
					{formState.errors.importance?.message}
				</Text>
			</div>
			<div className="flex flex-col gap-2">
				<Text description order="sm">
					Is this the first time seeing the peddler?
				</Text>
				<RadioRoot
					onValueChange={(v) =>
						v === "no" ? setValue("firstInteraction", false) : setValue("firstInteraction", true)
					}
					required
					className="flex gap-4"
					defaultValue="yes"
				>
					<RadioItem value="yes">Yes</RadioItem>
					<RadioItem value="no">No</RadioItem>
					<RadioItem value="maybe">Maybe</RadioItem>
				</RadioRoot>
				<Text order="sm" className="text-red-500 dark:text-red-400">
					{formState.errors.firstInteraction?.message}
				</Text>
			</div>

			{showNewPeddlerSection ? (
				<motion.div
					key="A"
					className="w-full flex flex-col gap-4"
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<Title order={6}>New Peddler Section</Title>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Surname/Name of Individual
						</Text>
						<div className="flex flex-col gap-1 w-full">
							<Text description order="xs">
								If not known, then use specific location, like under HDB block 111 auntie, but keep
								it consistent.
							</Text>
							<Text description order="xs">
								For first name: Jack (first name) For assigned (i.e. fake names): Alicia (assigned).
							</Text>
							<Text description order="xs">
								Please do not indicate location or gender here (these will be processed later; i.e.
								DO NOT write AMK_Lim_F). This value should be unique to avoid confusion.
							</Text>
						</div>
						<TextInput
							placeholder="eg. Lim / Jack (first name) / Alicia (assigned)"
							disabled={isPending}
							{...register("lastName")}
							variant={
								"lastName" in formState.errors && formState.errors.lastName ? "error" : undefined
							}
							helperText={
								"lastName" in formState.errors ? (formState.errors.lastName?.message as string) : ""
							}
							className="md:w-4/5"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							First Name
						</Text>
						<Text description order="xs">
							If not known, leave blank.
						</Text>
						<TextInput
							placeholder="eg. Joseph"
							disabled={isPending}
							{...register("firstName")}
							variant={
								"firstName" in formState.errors && formState.errors.firstName ? "error" : undefined
							}
							helperText={
								"firstName" in formState.errors
									? (formState.errors.firstName?.message as string)
									: ""
							}
							className="md:w-4/5"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Race of Individual
						</Text>

						<RadioRoot
							onValueChange={(v) =>
								setValue("race", v as "Chinese" | "Malay" | "Indian" | "Others")
							}
							required
							className="flex gap-4"
						>
							<RadioItem value="Chinese">Chinese</RadioItem>
							<RadioItem value="Malay">Malay</RadioItem>
							<RadioItem value="Indian">Indian</RadioItem>
							<RadioItem value="Others">Others</RadioItem>
						</RadioRoot>
						<Text order="sm" className="text-red-500 dark:text-red-400">
							{"race" in formState.errors && formState.errors.race?.message}
						</Text>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Sex of Individual
						</Text>

						<RadioRoot
							onValueChange={(v) => setValue("sex", v as "M" | "F")}
							required
							className="flex gap-4"
						>
							<RadioItem value="M">Male</RadioItem>
							<RadioItem value="F">Female</RadioItem>
						</RadioRoot>
						<Text order="sm" className="text-red-500 dark:text-red-400">
							{"sex" in formState.errors && formState.errors.sex?.message}
						</Text>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Year of Birth
						</Text>
						<Text description order="xs">
							Can be an estimate, eg. 1954-64
						</Text>
						<TextInput
							placeholder="eg. 1965"
							disabled={isPending}
							{...register("birthYear")}
							variant={
								"birthYear" in formState.errors && formState.errors.birthYear ? "error" : undefined
							}
							helperText={
								"birthYear" in formState.errors
									? (formState.errors.birthYear?.message as string)
									: ""
							}
							className="md:w-4/5"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Text description order="sm">
							Disability
						</Text>
						<Text description order="xs">
							Please insert only confirmed physical or mental disabilities.
						</Text>
						<MultiSelect
							items={allDisabilities.map((disability) => disability.name)}
							onChange={(val) => {
								setValue(
									"disabilityIds",
									allDisabilities
										.filter((disability) => val.includes(disability.name))
										.map((d) => d.id),
								);
							}}
							initialSelectedItems={[]}
							placeholder="eg. Wheelchair-bound"
							disabled={isPending}
							variant={
								"disabilityIds" in formState.errors && formState.errors.disabilityIds
									? "error"
									: undefined
							}
							helperText={
								"disabilityIds" in formState.errors
									? (formState.errors.disabilityIds?.message as string)
									: ""
							}
							className="md:w-4/5"
						/>
					</div>
				</motion.div>
			) : (
				<motion.div
					key="B"
					className="w-full flex flex-col gap-4"
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<Title order={6}>Existing Peddler Section</Title>
					<Autocomplete
						items={allPeddlers.map((peddler) => peddler.codename)}
						label="Peddler"
						handleChange={(val) => {
							const peddler = allPeddlers.find((p) => p.codename === val);
							if (peddler) {
								setValue("peddlerId", peddler.id);
							}
						}}
						placeholder="eg. AMK_Lim_F"
						disabled={isPending}
						variant={
							"peddlerId" in formState.errors && formState.errors.peddlerId ? "error" : undefined
						}
						helperText={
							"peddlerId" in formState.errors ? (formState.errors.peddlerId?.message as string) : ""
						}
						className="md:w-1/2"
					/>
				</motion.div>
			)}
			<Button type="submit" disabled={isPending} className="sm:w-1/5">
				Submit
			</Button>
		</form>
	);
}
