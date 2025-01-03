import type { ReactNode } from "react";
import type {
	TabProps as ReactTabsTabProps,
	TabsProps as ReactTabsTabsProps,
	TabListProps as ReactTabsTabListProps,
	TabPanelProps as ReactTabsTabPanelProps,
} from "react-tabs";

export interface TabProps extends ReactTabsTabProps {
	children: ReactNode;
	reducedMotion?: boolean;
	className?: string;
}

export interface TabsProps extends ReactTabsTabsProps {
	children: ReactNode;
	className?: string;
}

export interface TabListProps extends ReactTabsTabListProps {
	children: ReactNode;
	className?: string;
}

export interface TabPanelProps extends ReactTabsTabPanelProps {
	children: ReactNode;
	className?: string;
}
