import type { ZodString } from "zod";
import type { ButtonColor } from "@lib/components";

export type BooleanSettingsRowProps = {
	label: string;
	value: boolean;
	onChange: (newValue: boolean) => void;
};

export type ButtonSettingsRowProps = {
	label: string;
	buttonLabel: string;
	buttonColor?: ButtonColor;
	onClick: () => void;
};
export interface TextSettingsRowProps {
	fieldKey: string;
	label: string;
	description?: string;
	value?: string;
	schema: ZodString;
	onSubmit: (value: Record<string, string>) => Promise<void>;
	reducedMotion?: boolean;
}

export interface AutocompleteSettingsRowProps {
	fieldKey: string;
	label: string;
	value?: string;
	items: string[];
	onSubmit: (value: Record<string, string>) => Promise<void>;
}
