"use client";
import { Modal, TextInput, Title, ModalCloseButton, Text, Button, FileDrop } from "@lib/components";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { UpdateTeamInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateTeamInput } from "@shared/common/types";
import { useRouter } from "next/navigation";
import { updateTeam } from "./actions";
import { toast } from "react-hot-toast";
import { supportedFileTypes } from "@shared/common/constants";
import type { EditTeamProps } from "./types";
import { diffChanges } from "@utils";

export function EditTeam({ team }: EditTeamProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState } = useForm<Omit<UpdateTeamInput, "photo">>({
		resolver: zodResolver(UpdateTeamInputSchema),
		defaultValues: {
			name: team.name,
		},
	});

	const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: Omit<UpdateTeamInput, "photo">) {
		const formData = new FormData();
		const changes = await diffChanges(team, data);
		for (const [k, v] of Object.entries(changes)) {
			formData.append(k, v);
		}
		if (uploadedFiles) {
			formData.append("photo", uploadedFiles[0]);
		}

		const { status, error } = await updateTeam(team.id, formData);

		if (status === 200) {
			toast.success("Team updated successfully");
			router.refresh();
			setModalOpen(false);
			return;
		}
		toast.error(error?.cause || "An error occurred");
	}

	return (
		<>
			<Button onClick={() => setModalOpen(true)} color="warning" className="w-full">
				Edit
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Edit Team {team.name}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Teams are groups of users that are responsible for befriending peddlers in certain
					regions.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					<TextInput
						label="Name"
						placeholder="Enter a team name (eg. 'Johor Bahru')"
						disabled={isPending}
						{...register("name")}
						variant={formState.errors.name ? "error" : undefined}
						helperText={formState.errors.name?.message as string}
					/>
					<div className="flex flex-col gap-1 items-start">
						<Text description order="sm">
							Upload a photo
						</Text>
						<Text order="xs" description>
							⚠️This will replace the existing photo.
						</Text>
						<FileDrop
							optional
							onChange={(e) => setUploadedFiles(e.target.files)}
							accept={supportedFileTypes.join(",")}
							disabled={isPending}
						/>
					</div>

					<Button type="submit" color="success" disabled={isPending}>
						Update Team
					</Button>
				</form>
			</Modal>
		</>
	);
}
