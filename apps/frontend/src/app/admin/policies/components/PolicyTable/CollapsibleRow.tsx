import { useState } from "react";
import { Table } from "@lib/components";
import type { CollapsibleRowProps } from "./types";
import { motion, AnimatePresence } from "motion/react";

export function CollapsibleRow({ data, children }: CollapsibleRowProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Table.TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
				{data}
			</Table.TableRow>
			<AnimatePresence>
				{isOpen && (
					<Table.TableRow>
						<Table.TableCell colSpan={5} className="p-0">
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.05 }}
								className="overflow-hidden"
							>
								{children}
							</motion.div>
						</Table.TableCell>
					</Table.TableRow>
				)}
			</AnimatePresence>
		</>
	);
}
