"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordEmailSchema, NullSchema } from "@shared/common/schemas";
import type { ForgotPasswordEmail } from "@shared/common/types";
import { Button, TextInput } from "@lib/components";
import { query } from "@utils";
import { toast } from "react-hot-toast";
import { useTransition } from "react";

export function ForgotPasswordForm() {
	const { register, handleSubmit, formState } = useForm<ForgotPasswordEmail>({
		resolver: zodResolver(ForgotPasswordEmailSchema),
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit = handleSubmit((data) => {
		startTransition(async () => {
			// Send the email to the backend
			const { status } = await query({
				path: "/email/forgot-password",
				init: {
					method: "POST",
					body: JSON.stringify(data),
				},
				validator: NullSchema,
			});
			switch (status) {
				case 201:
					toast.success("Check your email for a password reset link!");
					break;
				case 404:
					toast.error("User not found");
					break;
				default:
					toast.error("Failed to send email");
					break;
			}
		});
	});

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
			<TextInput
				label="Email"
				type="text"
				variant={formState.errors.email ? "error" : undefined}
				helperText={formState.errors.email?.message}
				{...register("email")}
			/>

			<Button type="submit" disabled={isPending}>
				Submit
			</Button>
		</form>
	);
}
