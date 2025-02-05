"use client";
import {
	Modal,
	Title,
	ModalCloseButton,
	Text,
	Button,
	SubmitButton,
	DateInput,
	Autocomplete,
	TextInput,
	FileDrop,
	TextArea,
	RadioRoot,
	RadioItem,
} from "@lib/components";
import { supportedFileTypes } from "@shared/common/constants";
import { useContext, useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdateCaseInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Region, ErrorResponse, UpdateCaseInput } from "@shared/common/types";
import type { EditCaseProps } from "./types";
import { AuthContext } from "@lib/providers";
import { getRegions } from "./actions";

export function EditCase({ initialCase, revalidate }: EditCaseProps) {
	const { userHasPermission } = useContext(AuthContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [allRegions, setAllRegions] = useState<Region[]>([]);
	const [error, setError] = useState<ErrorResponse[]>([]);
	const [photos, setPhotos] = useState<FileList | null>(null);

	useEffect(() => {
		if (!modalOpen) return;
		const fetchData = async () => {
			try {
				const { data: regionsData, error: regionsError } = await getRegions();
				if (regionsData) {
					setAllRegions(regionsData);
				} else if (regionsError) {
					setError((a) => [...a, regionsError]);
				}
			} catch (error) {
				if (error instanceof Error) {
					setError((a) => [...a, { path: "unknown", name: "Unknown error", cause: error.message }]);
				}
			}
		};

		fetchData();
	}, [modalOpen]);

	const { register, handleSubmit, formState, setValue, reset } = useForm<
		Omit<UpdateCaseInput, "photos">
	>({
		resolver: zodResolver(UpdateCaseInputSchema),
		defaultValues: {
			regionId: initialCase.regionId,
			interactionDate: initialCase.interactionDate,
			location: initialCase.location,
			notes: initialCase.notes,
			importance: initialCase.importance,
			firstInteraction: initialCase.firstInteraction,
			peddlerId: initialCase.peddlerId,
		},
	});

	const [isPending, startTransition] = useTransition();

	async function onSubmit(data: Omit<UpdateCaseInput, "photos">) {
		console.log(data, photos);
		/*
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

		toast.error(error?.cause);
    */
	}

	if (!userHasPermission("case", "readWrite", initialCase)) {
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
				className="w-full"
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
					<Title order={5} className="break-all">
						Edit case {initialCase.id}
					</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Update the attributes of this case.
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
						<DateInput
							label="Date of Interaction"
							onChange={(date) => setValue("interactionDate", date)}
							containerClassName="sm:w-4/5"
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
							value={initialCase.regionName}
							onClickOutside={() => setValue("regionId", "")}
							placeholder="eg. Bishan"
							disabled={isPending}
							variant={formState.errors.regionId ? "error" : undefined}
							helperText={formState.errors.regionId?.message as string}
							className="md:w-4/5"
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
								Photo(s) of Peddler/Location
							</Text>
							<Text order="xs" description>
								⚠️This will replace the existing photos.
							</Text>
							<FileDrop
								onChange={(e) => setPhotos(e.target.files)}
								disabled={isPending}
								accept={supportedFileTypes.join(",")}
								multiple
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
							<Text order="xs" description>
								1 is least urgent, 5 is most urgent.
							</Text>

							<RadioRoot
								onValueChange={(v) => setValue("importance", Number(v) as 1 | 2 | 3 | 4 | 5)}
								defaultValue={initialCase.importance.toString()}
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
								onValueChange={(v) => setValue("firstInteraction", v === "true")}
								required
								className="flex gap-4"
								defaultValue={initialCase.firstInteraction.toString()}
							>
								<RadioItem value="true">Yes</RadioItem>
								<RadioItem value="false">No</RadioItem>
							</RadioRoot>
							<Text order="sm" className="text-red-500 dark:text-red-400">
								{formState.errors.firstInteraction?.message}
							</Text>
						</div>
						<SubmitButton disabled={isPending} className="w-full" />
					</form>
				)}
			</Modal>
		</>
	);
}
