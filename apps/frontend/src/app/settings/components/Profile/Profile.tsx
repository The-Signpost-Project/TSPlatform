"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { useContext } from "react";
import { AuthContext } from "@lib/providers";
import { toast } from "react-hot-toast";
import { TextSettingsRow } from "..";

export function Profile() {
	const { updateUser, user, loading } = useContext(AuthContext);

	if (loading || !user) {
		return null;
	}

	async function changeUsernameCallback(id: string, username: string) {
		updateUser({ id, username }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return;
			}
			toast.success("Username changed successfully");
		});
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
		</div>
	);
}
