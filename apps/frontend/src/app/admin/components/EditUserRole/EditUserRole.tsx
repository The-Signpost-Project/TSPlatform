"use client";
import { Modal, Title, ModalCloseButton, Text, Button, MultiSelect } from "@lib/components";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateUserInput, Prettify } from "@shared/common/types";
import { useRouter } from "next/navigation";
import type { EditUserRoleProps } from "./types";
import { updateUserRole } from "./actions";
import { toast } from "react-hot-toast";

export function EditUserRole({ roles, id, name }: EditUserRoleProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const { handleSubmit, setValue, reset } = useForm<Prettify<Pick<UpdateUserInput, "roles">>>({
		resolver: zodResolver(
			UpdateUserInputSchema.omit({
				username: true,
				email: true,
				verified: true,
				allowEmailNotifications: true,
			}),
		),
		defaultValues: {
			roles: roles.filter((role) => role.selected).map((r) => ({ roleId: r.id })),
		},
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: Prettify<Pick<UpdateUserInput, "roles">>) {
		const { status, error, data: response } = await updateUserRole(id, data);
		if (status === 200) {
			toast.success(`Roles for ${response?.username} updated.`);
			setModalOpen(false);
			router.refresh();
			return;
		}

		toast.error(error?.cause);
	}

	return (
		<>
			<Button color="warning" onClick={() => setModalOpen(true)}>
				Edit Roles
			</Button>
			<Modal
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					reset();
				}}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Edit user {name}'s Roles</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Assign roles to this user. Roles control access to your resources.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					{roles.length === 0 ? (
						<Text order="sm" description>
							No roles found. Create one first.
						</Text>
					) : (
						<MultiSelect
							items={roles.map((role) => role.name)}
							onChange={(value) =>
								setValue(
									"roles",
									roles.filter((role) => value.includes(role.name)).map((r) => ({ roleId: r.id })),
								)
							}
							placeholder="Search roles"
							initialSelectedItems={roles.filter((role) => role.selected).map((r) => r.name)}
						/>
					)}

					<Button type="submit" color="success" disabled={isPending || roles.length === 0}>
						Update Roles
					</Button>
				</form>
			</Modal>
		</>
	);
}
