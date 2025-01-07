"use client";
import type { ReactNode } from "react";
import { motion } from "motion/react";

export default function Template({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<motion.div
			initial={{ y: 1, opacity: 0.8 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ease: "easeInOut", duration: 0.05 }}
		>
			{children}
		</motion.div>
	);
}
