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
import { AddButton } from "../../../components";
import { useState, useTransition } from "react";
import { useForm, } from "react-hook-form";
import { CreateRoleInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRoleInput } from "@shared/common/types";
import { useRouter } from "next/navigation";
import type { AddRoleProps } from "./types";

export function AddRole({ policies }: AddRoleProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState, setValue, reset } =
		useForm<CreateRoleInput>({
			resolver: zodResolver(CreateRoleInputSchema),
		});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: CreateRoleInput) {
		console.log(data);
		/*const { status, error, data: response } = await createPolicy(data);
		if (status === 201) {
			toast.success(`Policy ${response?.name} created.`);
			setModalOpen(false);
			router.refresh();
			reset();
			return;
		}

		toast.error(error?.cause);
    */
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
					<Title order={5}>Add a Role</Title>
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
						/>
					)}

					<Button type="submit" color="success" disabled={isPending || policies.length === 0}>
						Create Role
					</Button>
				</form>
			</Modal>
		</>
	);
}
