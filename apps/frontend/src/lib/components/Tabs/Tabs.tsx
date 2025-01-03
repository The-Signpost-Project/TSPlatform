import {
	Tab as ExternalTab,
	Tabs as ExternalTabs,
	TabList as ExternalTabList,
	TabPanel as ExternalTabPanel,
	type ReactTabsFunctionComponent,
} from "react-tabs";
import { twMerge } from "tailwind-merge";
import type { TabProps, TabsProps, TabListProps, TabPanelProps } from "./types";
import type { ComponentType } from "react";
import { motion } from "framer-motion";

const defaultTabStyles = "px-4 py-2 cursor-pointer dark:border-gray-600 dark:text-gray-300";
const defaultActiveTabStyles = "h-1 bg-blue-500";
const defaultTabListStyles = "flex border-b dark:border-gray-600";
const defaultTabsStyles = "w-full";

// required to preserve the role of the component
function withComponentRole<T extends object>(
	role: "Tabs" | "TabList" | "Tab" | "TabPanel",
	Component: ComponentType<T>,
) {
	const WrappedComponent = Component as ReactTabsFunctionComponent<T>;
	WrappedComponent.tabsRole = role;

	return WrappedComponent;
}

export class Tabs {
	static Tab: ReactTabsFunctionComponent<TabProps> = withComponentRole(
		"Tab",
		({
			children,
			className,
			selected,
			selectedClassName,
			reducedMotion = false,
			...rest
		}: TabProps) => {
			const styles = twMerge(defaultTabStyles, className);
			const activeStyles = twMerge(defaultActiveTabStyles, selectedClassName);

			const renderActiveBar = () =>
				reducedMotion ? (
					<div className={activeStyles} />
				) : (
					<motion.div layoutId="underline" className={activeStyles} />
				);

			return (
				<ExternalTab className={styles} {...rest}>
					{children}
					{selected && renderActiveBar()}
				</ExternalTab>
			);
		},
	);

	static TabList: ReactTabsFunctionComponent<TabListProps> = withComponentRole(
		"TabList",
		({ children, className, ...rest }: TabListProps) => {
			const mergedStyles = twMerge(defaultTabListStyles, className);

			return (
				<ExternalTabList className={mergedStyles} {...rest}>
					{children}
				</ExternalTabList>
			);
		},
	);

	static TabPanel: ReactTabsFunctionComponent<TabPanelProps> = withComponentRole(
		"TabPanel",
		({ children, ...rest }: TabPanelProps) => {
			return <ExternalTabPanel {...rest}>{children}</ExternalTabPanel>;
		},
	);

	static Tabs: ReactTabsFunctionComponent<TabsProps> = withComponentRole(
		"Tabs",
		({ children, className, ...rest }: TabsProps) => {
			const mergedStyles = twMerge(defaultTabsStyles, className);

			return (
				<ExternalTabs className={mergedStyles} {...rest}>
					{children}
				</ExternalTabs>
			);
		},
	);
}
