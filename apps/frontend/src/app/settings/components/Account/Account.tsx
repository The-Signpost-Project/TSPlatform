"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { ButtonSettingsRow, TextSettingsRow } from "..";
import { useState, useContext } from "react";
import { AuthContext } from "@lib/providers";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { changePassword, sendVerifyEmail, deleteAccount } from "./actions";
import { toast } from "react-hot-toast";
import type { ChangePasswordInput } from "@shared/common/types";
import { useRouter } from "next/navigation";

export function Account() {
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
	const { user, loading, updateUser } = useContext(AuthContext);
	const router = useRouter();

	if (loading || !user) {
		return null;
	}

	function deleteAccountCallback(id: string) {
		deleteAccount(id).then(({ error }) => {
			setDeleteModalOpen(false);
			if (error) {
				toast.error(error.cause);
				return;
			}
			toast.success("Account deleted successfully");
			router.push("/");
		});
	}

	function changePasswordCallback(id: string, data: ChangePasswordInput) {
		changePassword(id, data).then(({ error }) => {
			setChangePasswordModalOpen(false);
			if (error) {
				toast.error(error.cause);

				return;
			}
			toast.success("Password changed successfully");

			router.refresh();
		});
	}

	function sendVerifyEmailCallback(id: string) {
		sendVerifyEmail(id).then(({ error }) => {
			if (error) {
				toast.error(error.cause);
				return;
			}
			toast.success("Verification email sent");
		});
	}

	async function changeEmailCallback(id: string, email: string) {
		updateUser({ id, email }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return;
			}
			toast.success("Email changed successfully");
		});
	}

	return (
		<>
			<div className="space-y-4">
				<TextSettingsRow
					fieldKey="email"
					label="Email"
					value={user.email ?? undefined}
					description="Your email is used for login and notifications."
					onSubmit={({ email }) => changeEmailCallback(user.id, email)}
					schema={UpdateUserInputSchema.required().shape.email}
				/>
				<ButtonSettingsRow
					label="Change Password"
					buttonLabel="Change"
					onClick={() => setChangePasswordModalOpen(true)}
				/>
				<ButtonSettingsRow
					label="Verify Email"
					buttonLabel="Verify"
					onClick={() => sendVerifyEmailCallback(user.id)}
				/>
				<ButtonSettingsRow
					label="Delete Account"
					buttonLabel="Delete"
					onClick={() => setDeleteModalOpen(true)}
					buttonColor="danger"
				/>
			</div>
			<DeleteAccountModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onSubmit={() => deleteAccountCallback(user.id)}
			/>
			<ChangePasswordModal
				isOpen={changePasswordModalOpen}
				onClose={() => setChangePasswordModalOpen(false)}
				onSubmit={(d) => changePasswordCallback(user.id, d)}
			/>
		</>
	);
}
