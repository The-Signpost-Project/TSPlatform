import type { Disability } from "@shared/common/types";
import type { QueryResult } from "@utils";
import type { HTMLAttributes } from "react";

export interface ManageDisabilitiesProps {}

export interface DisabilityPillProps extends HTMLAttributes<HTMLDivElement> {
	defaultName: string;
	onDelete: () => void;
	onUpdate: (newName: string) => void;
}
