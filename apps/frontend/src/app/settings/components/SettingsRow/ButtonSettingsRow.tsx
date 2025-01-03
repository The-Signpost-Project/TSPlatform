"use client";
import type { ButtonSettingsRowProps } from "./types";
import { Text, Button } from "@lib/components";
import { useTransition } from "react";

export function ButtonSettingsRow({
	label,
	buttonLabel,
	onClick,
	buttonColor,
}: ButtonSettingsRowProps) {
	const [isPending, startTransition] = useTransition();

	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>
			<Button onClick={() => startTransition(onClick)} color={buttonColor} disabled={isPending}>
				{buttonLabel}
			</Button>
		</div>
	);
}
