"use client";
import {
	Modal,
	TextInput,
	Title,
	ModalCloseButton,
	Text,
	Button,
	MultiSelect,
} from "@lib/components";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreateRoleInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateRoleInput } from "@shared/common/types";
import { useRouter } from "next/navigation";
import type { EditRoleProps } from "./types";
import { diffChanges } from "@utils";
import { updateRole } from "./actions";
import { toast } from "react-hot-toast";

export function EditRole({ policies, id, name }: EditRoleProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState, setValue, reset } = useForm<UpdateRoleInput>({
		resolver: zodResolver(CreateRoleInputSchema),
		defaultValues: {
			name,
			policies: policies.filter((policy) => policy.selected).map((p) => ({ id: p.id })),
		},
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: UpdateRoleInput) {
		const changes = await diffChanges(
			{
				name,
				policies: policies.filter((policy) => policy.selected).map((p) => ({ id: p.id })),
			},
			data,
		);

		const { status, error, data: response } = await updateRole(id, changes);
		if (status === 200) {
			toast.success(`Role ${response?.name} updated.`);
			setModalOpen(false);
			router.refresh();
			return;
		}

		toast.error(error?.cause ?? "An error occurred updating the role.");
	}

	return (
		<>
			<Button color="warning" onClick={() => setModalOpen(true)}>
				Edit
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
					<Title order={5}>Edit Role {name}</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Roles are groups of policies which are assigned to users.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					<TextInput
						label="Name"
						placeholder="Enter a descriptive name (eg. 'admin')"
						disabled={isPending}
						{...register("name")}
						variant={formState.errors.name ? "error" : undefined}
						helperText={formState.errors.name?.message as string}
					/>

					<div className="flex-grow">
						<Text order="sm" description>
							Policies
						</Text>
						<Text order="xs" description>
							Attach created policies to this role. Policies control access to your resources.
						</Text>
					</div>

					{policies.length === 0 ? (
						<Text order="sm" description>
							No policies found. Create one first.
						</Text>
					) : (
						<MultiSelect
							items={policies.map((policy) => policy.name)}
							onChange={(value) =>
								setValue(
									"policies",
									policies.filter((policy) => value.includes(policy.name)),
								)
							}
							placeholder="Search policies"
							initialSelectedItems={policies.filter((policy) => policy.selected).map((p) => p.name)}
						/>
					)}

					<Button
						type="submit"
						color="success"
						disabled={policies.length === 0}
						loading={isPending}
					>
						Update Role
					</Button>
				</form>
			</Modal>
		</>
	);
}
