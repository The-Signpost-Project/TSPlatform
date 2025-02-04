"use client";
import { Button, Modal, Title, Text, ModalCloseButton, Code } from "@lib/components";
import { useContext, useState } from "react";
import { deletePeddler } from "./actions";
import { toast } from "react-hot-toast";
import type { DeletePeddlerProps } from "./types";
import { AuthContext } from "@lib/providers";

export function DeletePeddler({ id, codename, navigateBack }: DeletePeddlerProps) {
	const { userHasPermission } = useContext(AuthContext);
	const [modalOpen, setModalOpen] = useState(false);

	async function onSubmit() {
		const { status, error } = await deletePeddler(id);
		if (status === 200) {
			toast.success(`Peddler ${codename} deleted.`);
			setModalOpen(false);
			navigateBack();
			return;
		}

		toast.error(error?.cause);
	}

	if (!userHasPermission("policy", "readWrite")) {
		return null;
	}

	return (
		<>
			<Button
				color="danger"
				onClick={(e) => {
					e.stopPropagation();
					setModalOpen(true);
				}}
				className="w-full"
			>
				Delete
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onClick={(e) => e.stopPropagation()}
				className="min-w-72 sm:min-w-96 flex flex-col justify-center cursor-default"
				modalClassName="fixed"
			>
				<div className="flex justify-between">
					<Title order={5}>Delete Peddler {codename}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description className="text-start">
					You are deleting peddler: <Code>{codename}</Code>. Any case associated with this peddler
					will be removed.
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
