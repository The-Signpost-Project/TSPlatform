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
import { useState, useTransition, use } from "react";
import { CreateDisabilityInputSchema, UpdateDisabilityInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRegionInput } from "@shared/common/types";
import { useRouter } from "next/navigation";
import { supportedFileTypes } from "@shared/common/constants";
import { getDisabilities } from "./actions";
import type { ManageDisabilitiesProps } from "./types";

export function ManageDisabilities({ disabilities }: ManageDisabilitiesProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const { data, error } = use(disabilities);

	const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: Omit<CreateRegionInput, "photo">) {
		console.info(data);
		/*
		const formData = new FormData();
		formData.append("name", data.name);
		if (uploadedFiles) {
			formData.append("photo", uploadedFiles[0]);
		}
		const { status, error } = await createRegion(formData);

		if (status === 201) {
			toast.success("Region created successfully");
			router.refresh();
			return;
		}
		toast.error(error?.cause || "An error occurred");
    */
	}

	return (
		<>
			<AddButton onClick={() => setModalOpen(true)} subject="Disabilities" />
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
			</Modal>
		</>
	);
}
