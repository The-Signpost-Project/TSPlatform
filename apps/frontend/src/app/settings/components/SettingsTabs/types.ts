import type { ReactElement } from "react";

interface Tab {
	name: string;
	element: ReactElement;
}

export interface SettingsTabsProps {
	tabs: Tab[];
}
