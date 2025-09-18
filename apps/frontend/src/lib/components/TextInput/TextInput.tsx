import type { TextInputProps } from "./types";
import { twMerge } from "tailwind-merge";

export function TextInput({
	label,
	variant,
	helperText,
	className,
	icon,
	...rest
}: TextInputProps) {
	const inputClasses = twMerge(
		"block w-full px-3 py-2 border rounded-md shadow-xs sm:text-sm focus:outline-hidden dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-500",
		variant === undefined ? "focus:border-orange-300" : "",
		variant === "success" ? "border-green-300 focus:border-green-500 dark:border-green-400" : "",
		variant === "error" ? "border-red-300 focus:border-red-500 dark:border-red-400" : "",
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
				<input className={inputClasses} {...rest} />
				{icon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center ">{icon}</div>}
			</div>
			{helperText && <p className={helperTextClasses}>{helperText}</p>}
		</div>
	);
}
