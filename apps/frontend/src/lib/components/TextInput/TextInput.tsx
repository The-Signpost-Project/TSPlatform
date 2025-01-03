import type { TextInputProps } from "./types";
import { twMerge } from "tailwind-merge";

export function TextInput({
	label,
	variant,
	helperText,
	disabled,
	className,
	icon,
	...rest
}: TextInputProps) {
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
		<div className={twMerge("flex flex-col items-start relative", className)}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is not available as id is a prop */}
			{label && <label className={helperTextClasses}>{label}</label>}
			<div className="relative w-full">
				<input className={inputClasses} disabled={disabled} {...rest} />
				{icon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center ">{icon}</div>}
			</div>
			{helperText && <p className={helperTextClasses}>{helperText}</p>}
		</div>
	);
}
