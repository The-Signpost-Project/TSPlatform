import { ForgotPasswordForm } from "./components";
import { Title, Text, Link } from "@lib/components";

export default function ForgotPassword() {
	return (
		<>
			<Title order={3}>Forgot Password</Title>
			<Text>
				Please enter the email associated with your account to reset your password. If you signed up
				via Google OAuth, you will need to reset your password through them instead.
			</Text>

			<ForgotPasswordForm />
			<Text>
				Go back to: <Link href="/auth/signup">Sign In</Link>
			</Text>
		</>
	);
}
