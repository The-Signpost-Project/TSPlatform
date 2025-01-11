"use client";
import { Modal, Pill, Title, Text, ModalCloseButton, Code, List } from "@lib/components";
import type { PolicyInfoModalProps } from "./types";
import { useState } from "react";
import { operatorMapping } from "@shared/common/constants";

export function PolicyInfoModal({ policy }: PolicyInfoModalProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Pill onClick={() => setOpen(true)} className="mr-1 cursor-pointer">
				{policy.name}
			</Pill>
			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				className="min-w-72 sm:min-w-96 flex flex-col gap-2"
			>
				<div className="flex justify-between">
					<Title order={5}>Information on {policy.name}</Title>
					<ModalCloseButton onClick={() => setOpen(false)} />
				</div>
				<div className="grid grid-cols-[25%_75%] gap-y-1 gap-x-2 w-full">
					<Text>Policy ID:</Text>
					<Code>{policy.id}</Code>
					<Text>Action:</Text>
					<Code>{policy.action === "read" ? "Read only" : "Read + Write"}</Code>
					<Text>Resource:</Text>
					<Code>{policy.resource}</Code>
					<Text>Unconditional:</Text>
					{policy.conditions.length === 0 ? (
						<Text className="text-green-600 dark:text-green-400">Yes</Text>
					) : (
						<Text className="text-red-600 dark:text-red-400">No</Text>
					)}
				</div>
				{policy.conditions.length === 0 ? (
					<Text description order="sm">
						This policy is unconditional and will always be applied.
					</Text>
				) : (
					<>
						<Text description order="sm">
							This policy is conditional and will only be applied if the following conditions are
							met:
						</Text>
						<List.OrderedList>
							{policy.conditions.map((condition) => (
								<List.ListItem key={condition.id} className="flex flex-row gap-2">
									<Text description order="sm">
										{condition.field}
									</Text>
									<Text description order="sm">
										{operatorMapping[condition.operator]}
									</Text>
									<Code className="text-sm">{condition.value}</Code>
								</List.ListItem>
							))}
						</List.OrderedList>
					</>
				)}
			</Modal>
		</>
	);
}
