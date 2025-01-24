import type { ReactNode, MouseEvent } from "react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
	modalClassName?: string;
	reducedMotion?: boolean;
	onClick?: (e: MouseEvent<HTMLDialogElement>) => void;
}

export interface ModalCloseButtonProps {
	onClick: () => void;
	accessibilityLabel?: string;
	className?: string;
}
