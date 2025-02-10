"use client";
import { Tabs } from "@lib/components";
import type { TeamTabsProps } from "./types";
import { TeamInfo } from "./TeamInfo";

export function TeamTabs({ teams }: TeamTabsProps) {
	return (
		<Tabs.Tabs>
			<Tabs.TabList>
				{teams.map((team) => (
					<Tabs.Tab key={team.id}>{team.name}</Tabs.Tab>
				))}
			</Tabs.TabList>
			{teams.map((team) => (
				<Tabs.TabPanel key={team.id} className="flex pt-2 gap-2">
					<TeamInfo team={team} />
					<div></div>
				</Tabs.TabPanel>
			))}
		</Tabs.Tabs>
	);
}
