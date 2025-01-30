import { Preferences } from "./components";
import { Title, Text } from "@lib/components";

export default function PreferencesPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">Preferences</Title>
				<Text description className="text-sm sm:text-base">
					Manage your client preferences. This will affect the look and feel of the site.
				</Text>
			</div>
			<Preferences />
		</div>
	);
}
