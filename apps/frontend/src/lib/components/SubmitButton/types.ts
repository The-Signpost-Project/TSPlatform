import type { ButtonProps } from "@lib/components";

export interface SubmitButtonProps extends Omit<ButtonProps, "children" | "color" | "type"> {
	subject?: string;
}
