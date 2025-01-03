import { Title } from "@lib/components";
import { Account, Preferences, Profile, SettingsTabs, type SettingsTabsProps } from "./components";

const tabs = [
	{ name: "Preferences", element: <Preferences /> },
	{ name: "Account", element: <Account /> },
	{ name: "Profile", element: <Profile /> },
] as const satisfies SettingsTabsProps["tabs"];

export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-2 sm:p-8 p-4">
			<Title order={1}>Settings</Title>
			<SettingsTabs tabs={tabs} />
		</div>
	);
}
