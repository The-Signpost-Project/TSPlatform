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
			<Accordion.Trigger {...props}>{children}</Accordion.Trigger>
			{withArrow && (
				<svg
					className="w-6 h-6 text-gray-800 dark:text-white"
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
			)}
		</Accordion.Header>
	);
}

export function AccordionContent({ children, ...props }: AccordionContentProps) {
	return <Accordion.Content {...props}>{children}</Accordion.Content>;
}

export function AccordionItem({ children, ...props }: AccordionItemProps) {
	return <Accordion.Item {...props}>{children}</Accordion.Item>;
}
