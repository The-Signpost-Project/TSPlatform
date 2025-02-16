"use client";
import { Modal, Title, ModalCloseButton, Text, Button, Code } from "@lib/components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeleteTeamProps } from "./types";
import { deleteTeam } from "./actions";
import { toast } from "react-hot-toast";

export function DeleteTeam({ team }: DeleteTeamProps) {
	const [modalOpen, setModalOpen] = useState(false);

	const router = useRouter();

	async function onSubmit() {
		const { status, error } = await deleteTeam(team.id);

		if (status === 200) {
			toast.success("Team deleted successfully");
			router.refresh();
			setModalOpen(false);
			return;
		}
		toast.error(error?.cause ?? "An error occurred deleting the team.");
	}

	return (
		<>
			<Button onClick={() => setModalOpen(true)} color="danger" className="w-full">
				Delete
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Delete Team {team.name}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description className="text-start">
					Are you sure you want to delete team: <Code>{team.name}</Code>?
				</Text>
				<div className="flex justify-end gap-2 mt-4">
					<Button onClick={() => setModalOpen(false)}>Cancel</Button>
					<Button color="danger" onClick={onSubmit}>
						Delete
					</Button>
				</div>
			</Modal>
		</>
	);
}
