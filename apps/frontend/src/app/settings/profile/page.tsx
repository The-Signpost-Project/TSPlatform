import { Profile } from "./components";
import { Title, Text } from "@lib/components";

export default function ProfilePage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">Profile</Title>
				<Text description className="text-sm sm:text-base">
					View and manage your public profile information.
				</Text>
			</div>
			<Profile />
		</div>
	);
}
