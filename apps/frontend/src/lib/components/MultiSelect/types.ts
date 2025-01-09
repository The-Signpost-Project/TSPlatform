export interface MultiSelectProps {
	items: string[];
	label?: string;
	placeholder?: string;
	className?: string;
	popoverClassName?: string;
	disabled?: boolean;
	helperText?: string;
	variant?: "success" | "error";
	onChange: (selectedItems: string[]) => void;
	parentElement?: HTMLElement;
}
