"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { useContext } from "react";
import { AuthContext } from "@lib/providers";
import { toast } from "react-hot-toast";
import { TextSettingsRow } from "..";
import { Text } from "@lib/components";

export function Profile() {
	const { updateUser, user, loading } = useContext(AuthContext);

	if (loading || !user) {
		return null;
	}

	async function changeUsernameCallback(id: string, username: string) {
		const success = await updateUser({ id, username }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return false;
			}
			toast.success("Username changed successfully");
			return true;
		});
		return success;
	}

	return (
		<div className="space-y-4">
			<TextSettingsRow
				fieldKey="username"
				label="Display Name"
				value={user?.username}
				description="Your username is used for login and display."
				onSubmit={({ username }) => changeUsernameCallback(user?.id, username)}
				schema={UpdateUserInputSchema.required().shape.username}
			/>
			<Text>(placeholder) {JSON.stringify(user.roles)}</Text>
		</div>
	);
}
