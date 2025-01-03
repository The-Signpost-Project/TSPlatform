"use client";
import { Modal, TextInput, Title, Text, Button, ModalCloseButton } from "@lib/components";
import { useContext, useTransition } from "react";
import { AuthContext } from "@lib/providers";
import { useForm } from "react-hook-form";
import { DeleteUserInputSchema } from "@shared/common/schemas";
import type { DeleteUserInput } from "@shared/common/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import type { DeleteAccountModalProps } from "./types";

export function DeleteAccountModal(props: DeleteAccountModalProps) {
	const { user, loading } = useContext(AuthContext);
	const { register, handleSubmit, formState } = useForm<DeleteUserInput>({
		resolver: zodResolver(
			DeleteUserInputSchema.superRefine((val, ctx) => {
				if (val.username !== user?.username) {
					ctx.addIssue({
						path: ["username"],
						code: "custom",
						message: "Username entered does not match your current username",
					});
				}
			}),
		),
	});

	const [isPending, startTransition] = useTransition();

	return (
		<Modal
			className={twMerge("flex-col flex gap-2 min-w-72 sm:min-w-96", props.className)}
			{...props}
		>
			<div className="flex justify-between">
				<Title order={5}>Delete Account</Title>
				<ModalCloseButton onClick={props.onClose} />
			</div>

			<Text order="sm">
				Enter your username (case-sensitive) to confirm. There's no going back!
			</Text>
			<form
				onSubmit={handleSubmit((args) => startTransition(() => props.onSubmit(args)))}
				className="flex flex-col justify-center gap-4"
			>
				<TextInput
					label="Username"
					placeholder="Enter your username"
					disabled={loading}
					{...register("username")}
					variant={formState.errors.username ? "error" : undefined}
					helperText={formState.errors.username?.message as string}
				/>
				<Button type="submit" color="danger" disabled={isPending}>
					Delete Account
				</Button>
			</form>
		</Modal>
	);
}
