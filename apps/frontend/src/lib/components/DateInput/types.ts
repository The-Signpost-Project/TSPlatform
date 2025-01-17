import type { DayPickerProps } from "react-day-picker";

export interface DateInputProps
	extends Omit<DayPickerProps, "selected" | "onSelect" | "mode" | "required"> {
	containerClassName?: string;
	variant?: "success" | "error";
	helperText?: string;
	label?: string;
	parentElement?: HTMLElement;
}
