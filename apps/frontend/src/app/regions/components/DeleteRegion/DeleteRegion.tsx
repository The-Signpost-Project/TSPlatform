"use client";
import { Modal, Title, ModalCloseButton, Text, Button, Code } from "@lib/components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeleteRegionProps } from "./types";
import { deleteRegion } from "./actions";
import { toast } from "react-hot-toast";

export function DeleteRegion({ region }: DeleteRegionProps) {
	const [modalOpen, setModalOpen] = useState(false);

	const router = useRouter();

	async function onSubmit() {
		const { status, error } = await deleteRegion(region.id);

		if (status === 200) {
			toast.success("Region deleted successfully");
			router.refresh();
			setModalOpen(false);
			return;
		}
		toast.error(error?.cause ?? "An error occurred deleting the region.");
	}

	return (
		<>
			<Button
				onClick={() => setModalOpen(true)}
				color="danger"
				className="w-full"
				variant="outlined"
			>
				Delete
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Delete Region {region.name}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description className="text-start">
					Are you sure you want to delete region: <Code>{region.name}</Code>? Note that all cases
					associated with this region must be removed or reassigned before deletion can proceed.
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
