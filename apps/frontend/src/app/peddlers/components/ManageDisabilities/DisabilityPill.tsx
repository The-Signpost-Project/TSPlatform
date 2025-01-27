"use client";
import { Button, Text, TextInput } from "@lib/components";
import type { DisabilityPillProps } from "./types";
import { useState, useOptimistic, useTransition } from "react";
import { updateDisability } from "./actions";
import { toast } from "react-hot-toast";

export function DisabilityPill({ id, defaultName, onDelete, ...rest }: DisabilityPillProps) {
	const [name, setName] = useState(defaultName);
	const [optimisticName, setOptimisticName] = useOptimistic(
		name,
		(_state, newName: string) => newName,
	);
	const isUpdating = name !== optimisticName;
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const updateDisabilityCb = async () => {
		startTransition(async () => {
			setOptimisticName(name);
			const { error, data } = await updateDisability(id, { name });
			if (error) {
				toast.error(error.cause);

				return;
			}
			if (!data) {
				toast.error(`An error occurred while updating disability with name ${name}`);
				return;
			}
			toast.success("Disability updated successfully");
			startTransition(() => {
				setIsEditing(false);
				setName(data.name);
			});
		});
	};
	return (
		<div
			className="flex items-center justify-between gap-1 bg-gray-200 dark:bg-gray-800 px-2 py-1.5 rounded"
			{...rest}
		>
			{isEditing ? (
				<TextInput
					value={optimisticName}
					onChange={(e) => setName(e.target.value)}
					className="w-full"
					disabled={isPending}
				/>
			) : (
				<Text order="sm">{name}</Text>
			)}
			<div className="flex gap-1">
				{isEditing ? (
					<Button
						onClick={updateDisabilityCb}
						className="p-0 border-0 h-6 w-6"
						color="warning"
						disabled={isPending}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-4 translate-x-[30%]"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg>
					</Button>
				) : (
					<Button
						onClick={() => setIsEditing(true)}
						className="p-0 border-0 h-6 w-6"
						color="warning"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-4 translate-x-[30%]"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
							/>
						</svg>
					</Button>
				)}

				<Button onClick={() => onDelete(id)} className="p-0 border-0 h-6 w-6" color="danger">
					<svg
						aria-hidden="true"
						className="size-4 translate-x-[30%]"
						viewBox="0 0 10 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.83196 5.00717L8.91955 1.91958C8.97526 1.86577 9.0197 1.8014 9.05027 1.73023C9.08084 1.65907 9.09693 1.58252 9.09761 1.50507C9.09828 1.42761 9.08352 1.3508 9.05419 1.27911C9.02486 1.20742 8.98155 1.14229 8.92677 1.08752C8.872 1.03275 8.80687 0.989433 8.73518 0.960103C8.66349 0.930772 8.58668 0.916013 8.50923 0.916686C8.43177 0.917359 8.35523 0.933451 8.28406 0.964023C8.21289 0.994595 8.14852 1.03903 8.09471 1.09475L5.00713 4.18233L1.91954 1.09475C1.80953 0.98849 1.66217 0.929693 1.50923 0.931022C1.35628 0.932351 1.20997 0.9937 1.10182 1.10185C0.993662 1.21001 0.932313 1.35632 0.930984 1.50926C0.929655 1.66221 0.988452 1.80956 1.09471 1.91958L4.18229 5.00717L1.09471 8.09475C1.039 8.14856 0.994557 8.21293 0.963985 8.2841C0.933413 8.35527 0.917321 8.43181 0.916648 8.50927C0.915975 8.58672 0.930734 8.66353 0.960065 8.73522C0.989395 8.80691 1.03271 8.87204 1.08748 8.92681C1.14225 8.98158 1.20738 9.0249 1.27907 9.05423C1.35076 9.08356 1.42757 9.09832 1.50503 9.09765C1.58248 9.09697 1.65903 9.08088 1.7302 9.05031C1.80137 9.01974 1.86573 8.9753 1.91954 8.91958L5.00713 5.832L8.09471 8.91958C8.20473 9.02584 8.35208 9.08464 8.50503 9.08331C8.65798 9.08198 8.80428 9.02063 8.91244 8.91248C9.02059 8.80432 9.08194 8.65801 9.08327 8.50507C9.0846 8.35212 9.0258 8.20477 8.91955 8.09475L5.83196 5.00717Z"
							fill="currentColor"
						/>
					</svg>
				</Button>
			</div>
		</div>
	);
}
