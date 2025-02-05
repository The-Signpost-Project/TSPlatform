import { Button } from "@lib/components";
import type { SubmitButtonProps } from "./types";

export function SubmitButton({ subject, ...props }: SubmitButtonProps) {
	return (
		<Button type="submit" color="success" {...props}>
			Save{subject ? ` ${subject}` : ""}
		</Button>
	);
}
