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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreateRegionInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRegionInput } from "@shared/common/types";
import { useRouter } from "next/navigation";

export function AddRegion() {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState } = useForm<CreateRegionInput>({
		resolver: zodResolver(CreateRegionInputSchema),
	});

	const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: CreateRegionInput) {
		console.log(data, uploadedFiles);
	}

	return (
		<>
			<AddButton onClick={() => setModalOpen(true)} subject="Role" />
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Add a Region</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Regions are real-world locations where peddlers are located.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					<TextInput
						label="Name"
						placeholder="Enter a region name (eg. 'Johor Bahru')"
						disabled={isPending}
						{...register("name")}
						variant={formState.errors.name ? "error" : undefined}
						helperText={formState.errors.name?.message as string}
					/>
					<div className="flex flex-col gap-1">
						<Text description order="sm">
							Upload a photo
						</Text>
						<FileDrop
							optional
							onChange={(e) => setUploadedFiles(e.target.files)}
							accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"].join(
								", ",
							)}
						/>
					</div>

					<Button type="submit" color="success" disabled={isPending}>
						Create Region
					</Button>
				</form>
			</Modal>
		</>
	);
}
