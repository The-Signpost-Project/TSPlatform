"use client";
import { Modal, TextInput, Title, ModalCloseButton, Text, Button } from "@lib/components";
import { useState, useTransition, useContext, useOptimistic, useEffect } from "react";
import { AuthContext } from "@/lib/providers";
import type { ErrorResponse, Disability } from "@shared/common/types";
import { DisabilityPill } from "./DisabilityPill";
import { createDisability, getDisabilities, deleteDisability } from "./actions";
import { toast } from "react-hot-toast";

export function ManageDisabilities() {
	const { userHasPermission } = useContext(AuthContext);
	const [modalOpen, setModalOpen] = useState(false);
	useEffect(() => {
		getDisabilities().then(({ data, error }) => {
			if (data) {
				setData(data);
			} else {
				setError(error);
			}
		});
	}, []);

	const [data, setData] = useState<Disability[]>([]);
	const [optimisticData, addOptimisticData] = useOptimistic(data, (state, newData: Disability) => [
		...state,
		newData,
	]);

	const [error, setError] = useState<ErrorResponse | null>(null);

	const [newName, setNewName] = useState("");

	const [isPending, startTransition] = useTransition();

	const createDisabilityCb = async (input: string) => {
		startTransition(async () => {
			addOptimisticData({ id: "123", name: input });
			const { error: createError } = await createDisability({ name: input });
			if (createError) {
				toast.error(createError.cause);
				return;
			}
			toast.success("Disability created successfully");
			setNewName("");
			const { data, error } = await getDisabilities();

			startTransition(() => {
				if (data) {
					setData(data);
				}

				setError(error);
			});
		});
	};

	const deleteDisabilityCb = async (id: string) => {
		startTransition(async () => {
			const { error: deleteError } = await deleteDisability(id);
			if (deleteError) {
				toast.error(deleteError.cause);
				return;
			}
			toast.success("Disability deleted successfully");
			const { data, error } = await getDisabilities();

			startTransition(() => {
				if (data) {
					setData(data);
				}

				setError(error);
			});
		});
	};

	if (!userHasPermission("disability", "read")) {
		return null;
	}

	return (
		<>
			<Button onClick={() => setModalOpen(true)} type="button" variant="outlined">
				Manage Disabilities
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96 flex flex-col gap-2"
			>
				<div>
					<div className="flex justify-between">
						<Title order={5}>Manage Disabilities</Title>
						<ModalCloseButton onClick={() => setModalOpen(false)} />
					</div>
					<Text order="sm" description>
						Create, update and delete disabilities that peddlers may have.
					</Text>
				</div>
				<div className="flex gap-2 justify-between items-end">
					<TextInput
						label="Disability Name"
						placeholder="eg. Blindness"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className="w-full"
						disabled={isPending}
					/>
					<Button
						onClick={() => createDisabilityCb(newName)}
						className="h-10 min-w-10 flex items-center justify-center p-0"
						color="success"
						disabled={isPending}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<title>Add disability</title>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</Button>
				</div>
				{error && (
					<>
						<Text order="sm">Error: {error.name}</Text>
						<Text order="sm">Cause: {error.cause}</Text>
					</>
				)}
				{data &&
					optimisticData.map((disability) => (
						<DisabilityPill
							key={disability.id}
							id={disability.id}
							defaultName={disability.name}
							onDelete={deleteDisabilityCb}
						/>
					))}
			</Modal>
		</>
	);
}
