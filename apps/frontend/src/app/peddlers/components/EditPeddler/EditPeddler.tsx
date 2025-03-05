"use client";
import {
	Modal,
	Title,
	ModalCloseButton,
	Text,
	Button,
	MultiSelect,
	Autocomplete,
	TextInput,
	RadioItem,
	RadioRoot,
} from "@lib/components";
import { useContext, useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdatePeddlerInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Region, Disability, ErrorResponse, UpdatePeddlerInput } from "@shared/common/types";
import type { EditPeddlerProps } from "./types";
import { AuthContext } from "@lib/providers";
import { getDisabilities } from "../ManageDisabilities";
import { getRegions, updatePeddler } from "./actions";
import { diffChanges } from "@utils";
import { toast } from "react-hot-toast";

export function EditPeddler({ peddler, revalidate }: EditPeddlerProps) {
	const { userHasPermission } = useContext(AuthContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [allDisabilities, setAllDisabilities] = useState<Disability[]>([]);
	const [allRegions, setAllRegions] = useState<Region[]>([]);
	const [error, setError] = useState<ErrorResponse[]>([]);
	useEffect(() => {
		if (!modalOpen) return;
		const fetchData = async () => {
			try {
				const [disabilitiesResponse, regionsResponse] = await Promise.all([
					getDisabilities(),
					getRegions(),
				]);

				if (disabilitiesResponse.data) {
					setAllDisabilities(disabilitiesResponse.data);
				} else if (disabilitiesResponse.error) {
					setError((a) => [...a, disabilitiesResponse.error as ErrorResponse]);
				}

				if (regionsResponse.data) {
					setAllRegions(regionsResponse.data);
				} else if (regionsResponse.error) {
					setError((a) => [...a, regionsResponse.error as ErrorResponse]);
				}
			} catch (error) {
				if (error instanceof Error) {
					setError((a) => [...a, { path: "unknown", name: "Unknown error", cause: error.message }]);
				}
			}
		};

		fetchData();
	}, [modalOpen]);

	const { register, handleSubmit, formState, setValue, watch, reset } = useForm<UpdatePeddlerInput>(
		{
			resolver: zodResolver(UpdatePeddlerInputSchema),
			defaultValues: {
				...peddler,
				disabilityIds: peddler.disabilities.map((d) => d.id) ?? [],
				mainRegionId: peddler.mainRegion.id,
			},
		},
	);

	const [isPending, startTransition] = useTransition();

	async function onSubmit(data: UpdatePeddlerInput) {
		const changes = await diffChanges(
			{
				...peddler,
				mainRegionId: peddler.mainRegion.id,
				disabilityIds: peddler.disabilities.map((d) => d.id),
			} satisfies UpdatePeddlerInput,
			data,
		);

		const {
			status,
			error,
			data: response,
		} = await updatePeddler(peddler.id, changes as Required<UpdatePeddlerInput>);
		if (status === 200) {
			toast.success(`Peddler ${response?.codename} updated.`);
			setModalOpen(false);
			const revalidateController = new AbortController();
			revalidate(revalidateController);
			return;
		}

		toast.error(error?.cause ?? "An error occurred updating the peddler.");
	}

	if (!userHasPermission("policy", "readWrite", peddler)) {
		return null;
	}

	return (
		<>
			<Button
				color="warning"
				onClick={(e) => {
					e.stopPropagation();
					setModalOpen(true);
				}}
				className="grow"
				variant="outlined"
			>
				Edit
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					reset();
				}}
				className="min-w-72 sm:min-w-96"
				onClick={(e) => e.stopPropagation()}
				modalClassName="fixed"
			>
				<div className="flex justify-between">
					<Title order={5}>Edit peddler {peddler.codename}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Update the attributes of the peddler.
				</Text>
				{error.map((e) => (
					<div key={e.path}>
						<Title order={5}>{e.name}</Title>
						<Text description>{e.cause}</Text>
					</div>
				))}
				{error.length === 0 && (
					<form
						onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
						className="flex flex-col justify-center gap-4 mt-4"
					>
						<Autocomplete
							items={allRegions.map((r) => r.name)}
							value={allRegions.find((r) => r.id === watch("mainRegionId"))?.name}
							label="Main Region"
							handleChange={(val) =>
								setValue("mainRegionId", allRegions.find((r) => r.name === val)?.id)
							}
							placeholder="Select a Region"
							disabled={isPending}
							variant={formState.errors.mainRegionId ? "error" : undefined}
							helperText={formState.errors.mainRegionId?.message as string}
						/>
						<TextInput
							label="First Name"
							{...register("firstName")}
							disabled={isPending}
							variant={formState.errors.firstName ? "error" : undefined}
							helperText={formState.errors.firstName?.message as string}
						/>
						<TextInput
							label="Last Name"
							{...register("lastName")}
							disabled={isPending}
							variant={formState.errors.lastName ? "error" : undefined}
							helperText={formState.errors.lastName?.message as string}
						/>
						<Autocomplete
							items={["Chinese", "Malay", "Indian", "Others"]}
							value={watch("race")}
							handleChange={(val) =>
								setValue("race", val as "Chinese" | "Malay" | "Indian" | "Others")
							}
							placeholder="Select a Race"
							disabled={isPending}
							variant={formState.errors.race ? "error" : undefined}
							helperText={formState.errors.race?.message as string}
						/>
						<div className="flex flex-col gap-2">
							<Text description order="sm">
								Sex of Individual
							</Text>

							<RadioRoot
								onValueChange={(v) => setValue("sex", v as "M" | "F")}
								required
								className="flex gap-4"
								value={watch("sex")}
							>
								<RadioItem value="M">Male</RadioItem>
								<RadioItem value="F">Female</RadioItem>
							</RadioRoot>
							<Text order="sm" className="text-red-500 dark:text-red-400">
								{formState.errors.sex?.message}
							</Text>
						</div>
						<TextInput
							label="Birth Year"
							{...register("birthYear")}
							disabled={isPending}
							variant={formState.errors.birthYear ? "error" : undefined}
							helperText={formState.errors.birthYear?.message as string}
						/>
						<div className="flex flex-col gap-2">
							<Text description order="sm">
								Disabilities
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
						<Button type="submit" color="success" className="w-full" loading={isPending}>
							Submit
						</Button>
					</form>
				)}
			</Modal>
		</>
	);
}
