"use client";
import type { SelfCasesProps } from "./types";
import {
	Card,
	Text,
	AccordionContent,
	AccordionItem,
	AccordionRoot,
	AccordionTrigger,
} from "@lib/components";
import { ImportanceText } from "@/app/cases/components";
import { AnimatePresence, motion } from "motion/react";

export function SelfCases({ cases }: SelfCasesProps) {
	return (
		<AccordionRoot type="multiple" className="flex gap-2 p-2 w-full overflow-auto">
			<AccordionItem value="2" className="w-full">
				<AccordionTrigger withArrow className="w-full flex mb-2">
					<Text order="lg">Your Cases</Text>
				</AccordionTrigger>
				<AccordionContent>
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.1 }}
							className="overflow-hidden grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
						>
							{cases.map((data) => (
								<Card
									key={data.id}
									title={data.peddlerCodename}
									date={data.interactionDate.toLocaleDateString()}
									description={data.id}
									className="px-2"
									descriptionClassName="break-all text-xs sm:text-xs"
									innerClassName="gap-2 px-2 flex flex-col justify-between h-full"
								>
									<Text className="grid grid-cols-2 gap-x-2 gap-y-1">
										<span className="font-medium justify-self-end">Updated At</span>
										<span className="justify-self-start">
											{data.updatedAt.toLocaleDateString()}
										</span>

										<span className="font-medium justify-self-end">Region</span>
										<span className="justify-self-start">{data.regionName}</span>

										<span className="font-medium justify-self-end">Importance</span>
										<span className="justify-self-start">
											<ImportanceText importance={data.importance} />
										</span>
									</Text>
								</Card>
							))}
						</motion.div>
					</AnimatePresence>
				</AccordionContent>
			</AccordionItem>
		</AccordionRoot>
	);
}
