import type { ComponentProps } from "react";
import type * as Accordion from "@radix-ui/react-accordion";

export type AccordionRootProps = ComponentProps<typeof Accordion.Root>;

export type AccordionTriggerProps = ComponentProps<typeof Accordion.Trigger> & {
	withArrow?: boolean;
};

export type AccordionContentProps = ComponentProps<typeof Accordion.Content>;

export type AccordionItemProps = ComponentProps<typeof Accordion.Item>;
