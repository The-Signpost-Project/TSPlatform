import { Account } from "./components";
import { Title, Text } from "@lib/components";

export default function AccountPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">Account</Title>
				<Text description className="text-sm sm:text-base">
					Manage your authorisation settings.
				</Text>
			</div>
			<Account />
		</div>
	);
}
