"use client";
import { AutocompleteSettingsRow, BooleanSettingsRow } from "..";
import { AuthContext, ClientContext } from "@lib/providers";
import { useContext } from "react";
import { toast } from "react-hot-toast";

// TODO: add data fetching
const timezones = Intl.supportedValuesOf("timeZone");

export function Preferences() {
	const { updateUser, user, loading } = useContext(AuthContext);
	const { theme, setTheme, reducedMotion, setReducedMotion } = useContext(ClientContext);

	if (loading || !user) {
		return null;
	}

	async function changeTimezoneCallback(id: string, timezone: string) {
		updateUser({ id, timezone }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return;
			}
			toast.success(`Timezone changed to ${timezone}`);
		});
	}

	async function changeAllowMarketingCallback(id: string, allowMarketing: boolean) {
		updateUser({ id, allowMarketing }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return;
			}
			toast.success(`Allow Marketing Emails changed to ${allowMarketing}`);
		});
	}

	return (
		<div className="space-y-4">
			<BooleanSettingsRow
				label="Dark Mode"
				value={theme === "dark"}
				onChange={(v) => setTheme(v ? "dark" : "light")}
			/>

			<BooleanSettingsRow
				label="Reduced Motion"
				value={reducedMotion}
				onChange={setReducedMotion}
			/>
			<BooleanSettingsRow
				label="Allow Marketing Emails"
				value={user.allowMarketing}
				onChange={(v) => changeAllowMarketingCallback(user.id, v)}
			/>

			<AutocompleteSettingsRow
				fieldKey="timezone"
				label="Timezone"
				value={"UTC"}
				items={timezones}
				onSubmit={({ timezone }) => changeTimezoneCallback(user.id, timezone)}
			/>
		</div>
	);
}
