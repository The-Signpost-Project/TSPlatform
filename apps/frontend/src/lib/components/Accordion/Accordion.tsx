"use client";
import * as Accordion from "@radix-ui/react-accordion";
import type {
	AccordionRootProps,
	AccordionTriggerProps,
	AccordionContentProps,
	AccordionItemProps,
} from "./types";
import { twMerge } from "tailwind-merge";

export function AccordionRoot({ children, ...props }: AccordionRootProps) {
	return <Accordion.Root {...props}>{children}</Accordion.Root>;
}
export function AccordionTrigger({ children, withArrow = false, ...props }: AccordionTriggerProps) {
	return (
		<Accordion.Header className={twMerge("overflow-auto", props.className)}>
			<Accordion.Trigger {...props} className="flex justify-between items-center w-full">
				{children}{" "}
				{withArrow && (
					<div className="flex items-center m-1 justify-center w-8 h-8  rounded-full hover:bg-gray-100 hover:dark:bg-gray-900 hover:text-zinc-700 text-zinc-900 hover:dark:text-zinc-200 dark:text-zinc-100 transition-colors duration-200">
						<svg
							className="w-6 h-6 "
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m8 10 4 4 4-4"
							/>
						</svg>
					</div>
				)}
			</Accordion.Trigger>
		</Accordion.Header>
	);
}

export function AccordionContent({ children, ...props }: AccordionContentProps) {
	return <Accordion.Content {...props}>{children}</Accordion.Content>;
}

export function AccordionItem({ children, ...props }: AccordionItemProps) {
	return <Accordion.Item {...props}>{children}</Accordion.Item>;
}
