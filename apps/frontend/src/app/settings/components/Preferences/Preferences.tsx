"use client";
import { AutocompleteSettingsRow, BooleanSettingsRow } from "..";
import { AuthContext, ClientContext } from "@lib/providers";
import { useContext } from "react";
import { toast } from "react-hot-toast";


export function Preferences() {
	const { updateUser, user, loading } = useContext(AuthContext);
	const { theme, setTheme, reducedMotion, setReducedMotion } = useContext(ClientContext);

	if (loading || !user) {
		return null;
	}

	async function changeAllowEmailCallback(id: string, allowEmailNotifications: boolean) {
		updateUser({ id, allowEmailNotifications }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return;
			}
			toast.success(`Email notifications ${allowEmailNotifications ? "enabled" : "disabled"}`);
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
				label="Allow Email Notifications"
				value={user.allowEmailNotifications}
				onChange={(v) => changeAllowEmailCallback(user.id, v)}
			/>

		</div>
	);
}
