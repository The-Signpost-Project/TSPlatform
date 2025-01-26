"use client";
import {
	Modal,
	TextInput,
	Title,
	ModalCloseButton,
	Text,
	Button,
	AddButton,
	FileDrop,
} from "@lib/components";
import { useState, useTransition, useContext, useOptimistic, useEffect } from "react";
import { AuthContext } from "@/lib/providers";
import { hasPermission } from "@shared/common/abac";
import { CreateDisabilityInputSchema, UpdateDisabilityInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorResponse, Disability } from "@shared/common/types";
import { useRouter } from "next/navigation";
import { supportedFileTypes } from "@shared/common/constants";
import type { ManageDisabilitiesProps } from "./types";
import { DisabilityPill } from "./DisabilityPill";
import { createDisability, getDisabilities } from "./actions";
import { toast } from "react-hot-toast";

export function ManageDisabilities() {
	const { user } = useContext(AuthContext);
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
	const router = useRouter();

	const createDisabilityCb = async (input: string) => {
		startTransition(async () => {
			addOptimisticData({ id: "123", name: input });
			const { error: createError } = await createDisability({ name: input });
			if (createError) {
				toast.error(createError.cause);
				return;
			}
			toast.success("Disability created successfully");
			const { data, error } = await getDisabilities();
			console.log(data, error);

			startTransition(() => {
				if (data) {
					setData(data);
				}

				setError(error);
			});
		});
	};

	if (
		!user ||
		!user.roles.flatMap((r) => r.policies).some((p) => hasPermission(p, "disability", "read"))
	) {
		return null;
	}

	return (
		<>
			<AddButton onClick={() => setModalOpen(true)} subject="Disabilities" />
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
					/>
					<Button
						onClick={() => createDisabilityCb(newName)}
						className="h-10 min-w-10 flex items-center justify-center p-0"
						color="success"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-6 w-6 flex-grow"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
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
							defaultName={disability.name}
							onDelete={() => console.info("delete")}
							onUpdate={(newName) => console.info(newName)}
							className="mt-2"
						/>
					))}
			</Modal>
		</>
	);
}
