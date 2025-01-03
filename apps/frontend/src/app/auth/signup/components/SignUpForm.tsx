"use client";

import { useContext, useTransition } from "react";
import { AuthContext } from "@lib/providers";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInputSchema } from "@shared/common/schemas";
import type { SignUpInput } from "@shared/common/types";
import { Button, TextInput } from "@lib/components";
import { toast } from "react-hot-toast";

export function SignUpForm() {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<SignUpInput>({
		resolver: zodResolver(SignUpInputSchema),
	});

	const { signUp } = useContext(AuthContext);
	const [isPending, startTransition] = useTransition();
	const onSubmit = handleSubmit((data) => {
		startTransition(async () => {
			const status = await signUp(data);
			switch (status) {
				case 201:
					toast.success("Account created successfully");
					router.push("/");
					break;
				case 400:
					toast.error("Invalid data provided");
					break;
				case 409:
					toast.error("Account already exists");
					break;
				default:
					toast.error("An unexpected error occurred");
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
			<TextInput
				label="Username"
				type="text"
				variant={formState.errors.username ? "error" : undefined}
				helperText={formState.errors.username?.message}
				{...register("username")}
			/>

			<TextInput
				label="Password"
				type="password"
				{...register("password")}
				variant={formState.errors.password ? "error" : undefined}
				helperText={formState.errors.password?.message}
			/>
			<TextInput
				label="Confirm Password"
				type="password"
				{...register("repeatPassword")}
				variant={formState.errors.repeatPassword ? "error" : undefined}
				helperText={formState.errors.repeatPassword?.message}
			/>
			<Button type="submit" disabled={isPending}>
				Continue
			</Button>
		</form>
	);
}
