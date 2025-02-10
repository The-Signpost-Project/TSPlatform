"use client";
import { Tabs } from "@lib/components";
import type { TeamTabsProps } from "./types";

export function TeamTabs({ teams }: TeamTabsProps) {
	return (
		<Tabs.Tabs>
			<Tabs.TabList>
				{teams.map((team) => (
					<Tabs.Tab key={team.id}>{team.name}</Tabs.Tab>
				))}
			</Tabs.TabList>
			{teams.map((team) => (
				<Tabs.TabPanel key={team.id}>
					<div>{JSON.stringify(team)}</div>
				</Tabs.TabPanel>
			))}
		</Tabs.Tabs>
	);
}
