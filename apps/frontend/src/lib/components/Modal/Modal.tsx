"use client";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import type { ModalProps } from "./types";
import { AnimatePresence, motion } from "framer-motion";

const modalDefaultStyles = `
!m-0 !translate-x-[-50%] !translate-y-[-50%] top-1/2 left-1/2
p-0 border-0 backdrop:backdrop-blur-sm
rounded-lg shadow-lg
`;

const defaultStyles = `
p-4
bg-white dark:bg-gray-900
`;

export function Modal({
	reducedMotion,
	children,
	isOpen,
	className,
	onClose,
	modalClassName,
}: ModalProps) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const modalStyles = twMerge(modalDefaultStyles, modalClassName);
	const styles = twMerge(defaultStyles, className);

	// always show modal if isOpen is true
	// parent handles unmounting
	useEffect(() => {
		if (modalRef.current && isOpen) {
			modalRef.current.showModal();
			modalRef.current.addEventListener("close", onClose);
			// close on click outside
			modalRef.current.addEventListener("click", (e) => {
				if (e.target === modalRef.current) {
					onClose();
				}
			});
		}
		return () => {
			modalRef.current?.removeEventListener("close", onClose);
			modalRef.current?.removeEventListener("click", (e) => {
				if (e.target === modalRef.current) {
					onClose();
				}
			});
		};
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.dialog
					initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.1 }}
					key="modal"
					ref={modalRef}
					className={modalStyles}
				>
					<div className={styles}>{children}</div>
				</motion.dialog>
			)}
		</AnimatePresence>
	);
}
