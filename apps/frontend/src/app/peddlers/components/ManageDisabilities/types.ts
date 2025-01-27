import type { HTMLAttributes } from "react";

export interface DisabilityPillProps extends HTMLAttributes<HTMLDivElement> {
	id: string;
	defaultName: string;
	onDelete: (id: string) => void;
}
