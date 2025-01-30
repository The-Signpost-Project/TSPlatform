"use client";
import { Modal, TextInput, Title, Text, Button, ModalCloseButton } from "@lib/components";
import { useContext, useTransition } from "react";
import { AuthContext } from "@lib/providers";
import { useForm } from "react-hook-form";
import { ChangePasswordInputSchema } from "@shared/common/schemas";
import type { ChangePasswordInput } from "@shared/common/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import type { ChangePasswordModalProps } from "./types";

export function ChangePasswordModal(props: ChangePasswordModalProps) {
	const { user, loading } = useContext(AuthContext);
	const { register, handleSubmit, formState } = useForm<ChangePasswordInput>({
		resolver: zodResolver(ChangePasswordInputSchema),
	});

	const [isPending, startTransition] = useTransition();

	return (
		<Modal
			className={twMerge("flex-col flex gap-2 min-w-72 sm:min-w-96", props.className)}
			{...props}
		>
			<div className="flex justify-between">
				<Title order={5}>Change Password</Title>
				<ModalCloseButton onClick={props.onClose} />
			</div>

			<Text order="sm">
				{user?.hasPassword
					? "You can change your password here."
					: "Since you do not have a password, please set one."}
			</Text>
			<form
				onSubmit={handleSubmit((args) => startTransition(() => props.onSubmit(args)))}
				className="flex flex-col justify-center gap-4"
			>
				{user?.hasPassword ? (
					<TextInput
						label="Old Password"
						placeholder="Enter your previous password"
						disabled={loading}
						{...register("oldPassword")}
						variant={formState.errors.oldPassword ? "error" : undefined}
						helperText={formState.errors.oldPassword?.message as string}
					/>
				) : (
					<TextInput
						type="hidden"
						className="hidden"
						disabled={true}
						value={undefined}
						{...register("oldPassword")}
					/>
				)}

				<TextInput
					label="New Password"
					placeholder="Enter a new password"
					disabled={loading}
					{...register("newPassword")}
					variant={formState.errors.newPassword ? "error" : undefined}
					helperText={formState.errors.newPassword?.message as string}
				/>
				<TextInput
					label="Repeat New Password"
					placeholder="Repeat your new password"
					disabled={loading}
					{...register("repeatPassword")}
					variant={formState.errors.repeatPassword ? "error" : undefined}
					helperText={formState.errors.repeatPassword?.message as string}
				/>
				<Button type="submit" disabled={isPending}>
					Submit
				</Button>
			</form>
		</Modal>
	);
}
