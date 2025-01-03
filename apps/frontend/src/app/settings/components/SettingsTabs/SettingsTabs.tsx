"use client";
import { Tabs } from "@lib/components";
import type { SettingsTabsProps } from "./types";
import { motion } from "framer-motion";

export function SettingsTabs({ tabs }: SettingsTabsProps) {
	return (
		<Tabs.Tabs>
			<Tabs.TabList className="overflow-x-scroll">
				{tabs.map((tab) => {
					return <Tabs.Tab key={tab.name}>{tab.name}</Tabs.Tab>;
				})}
			</Tabs.TabList>

			{tabs.map((tab) => {
				return (
					<Tabs.TabPanel key={tab.name}>
						<motion.div
							initial={{ opacity: 0.7, y: 2 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className="pt-2"
						>
							{tab.element}
						</motion.div>
					</Tabs.TabPanel>
				);
			})}
		</Tabs.Tabs>
	);
}
