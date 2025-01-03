export type AutocompleteProps = {
	items: string[];
	value?: string;
	handleChange: (value: string) => void;
	label?: string;
	popoverClassName?: string;
	className?: string;
	placeholder?: string;
	parentElement?: HTMLElement;
	disabled?: boolean;
};

export type AutocompleteChoiceProps = {
	item: string;
	onSelect: (item: string) => void;
	isPending?: boolean;
};
