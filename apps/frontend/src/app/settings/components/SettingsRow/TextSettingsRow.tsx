"use client";
import { useState } from "react";
import type { TextSettingsRowProps } from "./types";
import { Text, Button, Modal, Title, ModalCloseButton } from "@lib/components";
import { TextField } from "../TextField";

export function TextSettingsRow({
	fieldKey,
	label,
	value,
	schema,
	onSubmit,
	reducedMotion,
	description,
}: TextSettingsRowProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>

			<div className="flex gap-2 items-center">
				<Text order="sm">{!value ? `No ${label.toLowerCase()} provided` : value}</Text>
				<Button
					aria-label={`Update ${label}`}
					className="w-8 h-8 flex items-center justify-center border-none rounded-full bg-transparent hover:bg-gray-100 hover:dark:bg-gray-900 hover:text-zinc-700 text-zinc-900 hover:dark:text-zinc-200 dark:text-zinc-100 transition-colors duration-200"
					onClick={() => setOpen(true)}
				>
					<svg
						aria-label={`Update ${label}`}
						className="h-5 min-w-5 fill-current flex-1"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<title>Update {label}</title>
						<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
					</svg>
				</Button>
			</div>
			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				reducedMotion={reducedMotion}
				className="flex-col flex gap-2 w-80 sm:w-full"
			>
				<div className="flex justify-between">
					<Title order={5}>Update {label}</Title>
					<ModalCloseButton onClick={() => setOpen(false)} />
				</div>
				{description && <Text order="sm">{description}</Text>}
				<TextField
					fieldKey={fieldKey}
					placeholder={`No ${label.toLowerCase()} provided`}
					value={value}
					onSubmit={async (val) => onSubmit(val).then(() => setOpen(false))}
					zodSchema={schema}
				/>
			</Modal>
		</div>
	);
}
