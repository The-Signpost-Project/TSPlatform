"use client";
import { Button, Modal, Title, Text, ModalCloseButton, Code } from "@lib/components";
import { useState } from "react";
import { deletePolicy } from "./actions";
import { toast } from "react-hot-toast";
import type { DeletePolicyProps } from "./types";
import { useRouter } from "next/navigation";

export function DeletePolicy({ id, name }: DeletePolicyProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const router = useRouter();

	async function onSubmit() {
		const { status, error } = await deletePolicy(id);
		if (status === 200) {
			toast.success(`Policy ${name} deleted.`);
			setModalOpen(false);
			router.refresh();
			return;
		}

		toast.error(error?.cause);
	}

	return (
		<>
			<Button
				color="danger"
				onClick={(e) => {
					e.stopPropagation();
					setModalOpen(true);
				}}
			>
				Delete
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onClick={(e) => e.stopPropagation()}
				className="min-w-72 sm:min-w-96 flex flex-col justify-center cursor-default"
			>
				<div className="flex justify-between">
					<Title order={5}>Delete Policy</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text description>
					You are deleting policy: <Code>{name}</Code>. Any role with this policy will have it
					removed. Any user who previously had this policy will no longer be able to access the
					resources associated with it.
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
