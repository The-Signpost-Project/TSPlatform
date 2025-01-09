"use client";
import { Button, Modal, Title, Text, ModalCloseButton, Code } from "@lib/components";
import { useState } from "react";
import type { DeleteRoleProps } from "./types";
import { useRouter } from "next/navigation";
import { deleteRole } from "./actions";
import { toast } from "react-hot-toast";

export function DeleteRole({ id, name }: DeleteRoleProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const router = useRouter();

	async function onSubmit() {
		
		const { status, error } = await deleteRole(id);
		if (status === 200) {
			toast.success(`Role ${name} deleted successfully`);
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
					<Title order={5}>Delete Role</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text description>
					You are deleting role: <Code>{name}</Code>. Any users with this role will lose it.
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
