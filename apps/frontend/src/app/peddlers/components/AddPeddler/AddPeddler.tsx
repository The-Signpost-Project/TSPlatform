"use client";
import {
	Modal,
	Title,
	ModalCloseButton,
	Text,
	AddButton,
	RadioRoot,
	RadioItem,
	TextInput,
	MultiSelect,
	Button,
	Autocomplete,
} from "@lib/components";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreatePeddlerInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreatePeddlerInput, Disability, Region } from "@shared/common/types";
import { fetchDisabilities, fetchRegions } from "./utils";
import { createPeddler } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function AddPeddler() {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState, setValue, reset } = useForm<CreatePeddlerInput>({
		resolver: zodResolver(CreatePeddlerInputSchema),
	});

	const [allDisabilities, setAllDisabilities] = useState<Disability[]>([]);
	const [allRegions, setAllRegions] = useState<Region[]>([]);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!modalOpen) return;

		const controller = new AbortController();
		const getData = async () => {
			const { allDisabilities, fetchDisabilitiesError } = await fetchDisabilities(
				controller.signal,
			);
			const { allRegions, fetchRegionsError } = await fetchRegions(controller.signal);
			if (fetchDisabilitiesError || !allDisabilities || fetchRegionsError || !allRegions) {
				console.warn(fetchDisabilitiesError);
				return;
			}
			setAllDisabilities(allDisabilities);
			setAllRegions(allRegions);
		};
		getData();
		return () => controller.abort();
	}, [modalOpen]);

	const router = useRouter();

	async function onSubmit(input: CreatePeddlerInput) {
		const { data, error, status } = await createPeddler(input);
		if (status === 201) {
			toast.success(`Peddler ${data?.codename} created.`);
			setModalOpen(false);
			router.refresh();
			reset();
			return;
		}

		toast.error(error?.cause ?? "An error occurred creating the peddler.");
	}

	return (
		<>
			<AddButton onClick={() => setModalOpen(true)} subject="Peddler" />
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Add a Peddler</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Create a new peddler profile.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					<Autocomplete
						items={allRegions.reduce((acc, region) => {
							acc.push(region.name);
							return acc;
						}, [] as string[])}
						label="Region"
						handleChange={(val) => {
							const region = allRegions.find((r) => r.name === val);
							if (region) {
								setValue("mainRegionId", region.id);
							}
						}}
						onClickOutside={() => setValue("mainRegionId", "")}
						placeholder="eg. Bishan"
						disabled={isPending}
						variant={formState.errors.mainRegionId ? "error" : undefined}
						helperText={formState.errors.mainRegionId?.message as string}
						className="w-full"
					/>
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
								DO NOT write AMK_Lim_F). If there are multiple peddlers with the same last name and
								sex in the same region, please differentiate them to avoid confusion.
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
							Disabilities
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
							className="w-full"
						/>
					</div>
					<Button type="submit" disabled={isPending} className="w-full">
						Submit
					</Button>
				</form>
			</Modal>
		</>
	);
}
