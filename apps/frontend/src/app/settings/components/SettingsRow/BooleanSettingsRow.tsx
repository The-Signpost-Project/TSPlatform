"use client";
import type { BooleanSettingsRowProps } from "./types";
import { Text, Toggle } from "@lib/components";
import { useTransition } from "react";

export function BooleanSettingsRow({ label, value, onChange }: BooleanSettingsRowProps) {
	const [isPending, startTransition] = useTransition();
	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>
			<Toggle
				defaultChecked={value}
				onChange={(e) => startTransition(() => onChange(e.target.checked))}
				disabled={isPending}
			/>
		</div>
	);
}
