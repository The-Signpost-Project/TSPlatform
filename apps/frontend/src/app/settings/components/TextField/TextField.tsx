"use client";
import { TextInput, Button } from "@lib/components";
import { useKeybinds } from "@lib/hooks";
import { useTransition } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TextFieldProps } from "./types";

export function TextField<T extends string>({
	fieldKey,
	label,
	value,
	onSubmit,
	placeholder,
	zodSchema,
}: TextFieldProps<T>) {
	useKeybinds({
		Enter: () => {
			handleSubmit(submitCb)();
		},
	});
	const [isPending, startTransition] = useTransition();
	const { register, handleSubmit, formState } = useForm<Record<typeof fieldKey, string>>({
		resolver: zodResolver(
			z.object({
				[fieldKey]: zodSchema,
			}),
		),
		defaultValues: {
			[fieldKey]: value,
		} as DefaultValues<Record<T, string>>,
	});

	const submitCb = (data: Record<T, string>) => {
		startTransition(async () => {
			await onSubmit(data);
		});
	};
	return (
		<form onSubmit={handleSubmit(submitCb)}>
			<div className="flex flex-col sm:flex-row gap-4 w-full items-center">
				<TextInput
					label={label}
					disabled={isPending}
					placeholder={placeholder}
					{...register(fieldKey as unknown as Path<Record<T, string>>)}
					variant={formState.errors[fieldKey] ? "error" : undefined}
					helperText={formState.errors[fieldKey]?.message as string}
					className="w-full sm:w-72 md:w-96"
				/>
				<Button disabled={isPending} type="submit" className="grow-0">
					Save
				</Button>
			</div>
		</form>
	);
}
