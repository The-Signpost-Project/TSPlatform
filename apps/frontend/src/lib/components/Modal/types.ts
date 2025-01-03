import type { ReactNode } from "react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
	modalClassName?: string;
	reducedMotion?: boolean;
}
