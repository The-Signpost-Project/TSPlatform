import { ResetPasswordForm } from "./components";
import { Title, Text } from "@lib/components";

export default async function ResetPasswordPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	return (
		<>
			<Title order={3}>Reset Password</Title>
			<Text>Choose your new password.</Text>
			<ResetPasswordForm token={token} />
		</>
	);
}
