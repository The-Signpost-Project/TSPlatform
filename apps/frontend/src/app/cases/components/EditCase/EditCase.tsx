"use client";
import { Modal, Title, ModalCloseButton, Text, Button, SubmitButton } from "@lib/components";
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

	const { register, handleSubmit, formState, setValue, watch, reset } = useForm<
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

	async function onSubmit(data: UpdateCaseInput) {
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
					<Title order={5}>Edit case {initialCase.id}</Title>
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
						<SubmitButton disabled={isPending} className="w-full" />
					</form>
				)}
			</Modal>
		</>
	);
}
