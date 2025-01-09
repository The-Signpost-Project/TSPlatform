"use client";
import { useState, useDeferredValue, useRef } from "react";
import { Popover } from "react-tiny-popover";
import { Text, Button, TextInput } from "@lib/components";
import type { MultiSelectProps } from "./types";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export function MultiSelect({
	items,
	label,
	placeholder,
	className,
	popoverClassName,
	disabled,
	helperText,
	variant,
	onChange,
	parentElement,
}: MultiSelectProps) {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search);
	const isPending = deferredSearch !== search;
	const ref = useRef<HTMLInputElement>(null);

	const filteredItems = items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

	const handleSelect = (item: string) => {
		if (!selectedItems.includes(item)) {
			const newSelectedItems = [...selectedItems, item];
			setSelectedItems(newSelectedItems);
			onChange(newSelectedItems);
		}
	};

	const handleRemove = (item: string) => {
		const newSelectedItems = selectedItems.filter((i) => i !== item);
		setSelectedItems(newSelectedItems);
		onChange(newSelectedItems);
	};

	return (
		<div className={className}>
			<Popover
				isOpen={open}
				positions={["bottom", "left"]}
				onClickOutside={() => {
					setSearch("");
					setOpen(false);
				}}
				align="start"
				padding={5}
				ref={ref}
				parentElement={parentElement ?? document.body}
				containerClassName="z-50"
				content={
					<motion.div
						className={twMerge(
							"bg-white dark:bg-zinc-900 rounded-md shadow-md p-2 min-w-fit overflow-y-auto max-h-60",
							popoverClassName,
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						style={{ width: ref.current?.clientWidth }}
					>
						{filteredItems.length !== 0 ? (
							filteredItems.map((item) => (
								<button
									className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex justify-between items-center"
									onClick={() => {
										if (selectedItems.includes(item)) {
											handleRemove(item);
										} else {
											handleSelect(item);
										}
									}}
									disabled={isPending}
									type="button"
									key={item}
								>
									<Text order="sm" className={isPending ? "text-gray-600 dark:text-gray-500" : ""}>
										{item}
									</Text>
									{selectedItems.includes(item) ? (
										<svg
											className="w-4 h-4 text-gray-800 dark:text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 11.917 9.724 16.5 19 7.5"
											/>
										</svg>
									) : null}
								</button>
							))
						) : (
							<Text order="sm" className="w-full p-2 text-left rounded-md">
								Nothing found...
							</Text>
						)}
					</motion.div>
				}
			>
				<TextInput
					label={label}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onFocus={() => setOpen(true)}
					className={className}
					placeholder={placeholder}
					disabled={disabled}
					helperText={helperText}
					variant={variant}
					icon={
						<button onClick={() => setOpen((o) => !o)} type="button" className="cursor-pointer">
							<svg
								aria-label="dropdown"
								className="h-5 min-w-5 dark:fill-white flex-1 transform rotate-90"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<title>dropdown</title>
								<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
							</svg>
						</button>
					}
				/>
			</Popover>

			<div className="flex flex-wrap gap-2 mt-2">
				{selectedItems.map((item) => (
					<div
						key={item}
						className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-2 py-1.5 rounded"
					>
						<Text order="sm">{item}</Text>
						<Button
							onClick={() => handleRemove(item)}
							className="p-0 border-0 h-6 w-6"
							color="danger"
						>
							<svg
								aria-hidden="true"
								className="w-2.5 h-2.5 translate-x-[70%]"
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
				))}
			</div>
		</div>
	);
}
