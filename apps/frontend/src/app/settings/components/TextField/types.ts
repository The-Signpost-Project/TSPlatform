import type { ZodString } from "zod";

export interface TextFieldProps<T extends string> {
	fieldKey: T;
	label?: string;
	zodSchema: ZodString;
	value?: string;
	placeholder?: string;
	onSubmit: (value: Record<T, string>) => Promise<void>;
}
