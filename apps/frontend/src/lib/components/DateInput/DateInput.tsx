"use client";
import { useId, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateInputProps } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { twMerge } from "tailwind-merge";
import { Popover } from "react-tiny-popover";

export function DateInput({
	containerClassName,
	variant,
	helperText,
	label,
	parentElement,
	onChange,
	...rest
}: DateInputProps) {
	const inputId = useId();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [inputFocused, setInputFocused] = useState(false);
	const inputClasses = twMerge(
		"block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 disabled:text-gray-400 disabled:dark:text-gray-500",
		variant === undefined ? "focus:ring-indigo-500 focus:border-indigo-500" : "",
		variant === "success"
			? "border-green-300 focus:ring-green-500 focus:border-green-500 dark:border-green-400"
			: "",
		variant === "error"
			? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-400"
			: "",
	);

	const helperTextClasses = twMerge(
		"mt-1 text-sm text-gray-600 dark:text-gray-400",
		variant === "success" ? "text-green-600 dark:text-green-400" : "",
		variant === "error" ? "text-red-600 dark:text-red-400" : "",
	);
	return (
		<div className={containerClassName} id={inputId}>
			<AnimatePresence>
				<Popover
					isOpen={inputFocused}
					positions={["bottom", "left"]}
					onClickOutside={() => setInputFocused(false)}
					align="start"
					padding={5}
					containerClassName="z-50"
					parentElement={parentElement ?? document.body}
					content={
						inputFocused && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="overflow-auto"
							>
								<DayPicker
									{...rest}
									selected={selectedDate}
									onSelect={(date) => {
										onChange?.(date);
										setSelectedDate(date);
										setInputFocused(false);
									}}
									mode="single"
									required
									className="sm:p-3 sm:w-72 p-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-md"
									classNames={{
										months: "relative flex flex-wrap justify-center gap-8",
										month_caption:
											"flex items-center font-medium text-lg h-9 px-2 text-gray-900 dark:text-gray-100",

										nav: "absolute inset-x-0 flex justify-end items-center h-9 gap-2",
										button_next:
											"relative inline-flex items-center justify-center size-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded",
										button_previous:
											"relative inline-flex items-center justify-center size-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded",
										chevron: "inline-block size-7 fill-gray-400",
										week: "grid grid-cols-7",
										weekdays: "grid grid-cols-7",
										weekday:
											"size-9 flex items-center justify-center text-gray-500 dark:text-gray-400",
										day_button: "size-9",
										day: "inline-flex items-center justify-center rounded text-gray-700 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:dark:bg-gray-800 hover:dark:text-gray-300 font-normal aria-selected:opacity-100 cursor-pointer",
										today: "font-semibold",
										selected: "bg-blue-500 text-white focus:bg-blue-500 focus:text-white",
										outside: "text-gray-500 opacity-50",
										disabled: "text-gray-500 opacity-50 cursor-auto",
										range_middle:
											"aria-selected:bg-blue-50 aria-selected:text-gray-900 aria-selected:hover:bg-blue-200 rounded-none ",
										hidden: "invisible",
									}}
								/>
							</motion.div>
						)
					}
				>
					<div className="flex flex-col items-start relative">
						{/* biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is not available as id is a prop */}
						{label && <label className={helperTextClasses}>{label}</label>}
						<input
							type="text"
							value={selectedDate.toLocaleDateString()}
							onFocus={() => setInputFocused(true)}
							readOnly
							className={inputClasses}
						/>
						{helperText && <p className={helperTextClasses}>{helperText}</p>}
					</div>
				</Popover>
			</AnimatePresence>
		</div>
	);
}
