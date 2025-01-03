"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordResetSchema, NullSchema } from "@shared/common/schemas";
import type { ForgotPasswordReset } from "@shared/common/types";
import { Button, TextInput } from "@lib/components";
import { query } from "@utils";
import { toast } from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }: { token: string }) {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<ForgotPasswordReset>({
		resolver: zodResolver(ForgotPasswordResetSchema),
		defaultValues: {
			token,
		},
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit = handleSubmit((data) => {
		startTransition(async () => {
			// Send the email to the backend
			const { status } = await query({
				path: "/auth/reset-password",
				init: {
					method: "POST",
					body: JSON.stringify(data),
				},
				validator: NullSchema,
			});

			switch (status) {
				case 201:
					toast.success("Password reset successfully!");
					router.push("/auth/signin");
					break;
				case 400:
					toast.error("Invalid data provided. The token may have expired.");
					break;
				default:
					toast.error("Failed to reset password");
					break;
			}
		});
	});

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
			<TextInput
				label="New Password"
				type="password"
				variant={formState.errors.newPassword ? "error" : undefined}
				helperText={formState.errors.newPassword?.message}
				{...register("newPassword")}
			/>
			<TextInput type="hidden" {...register("token")} />

			<Button type="submit" disabled={isPending}>
				Submit
			</Button>
		</form>
	);
}
