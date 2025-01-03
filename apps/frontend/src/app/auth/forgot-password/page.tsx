import { ForgotPasswordForm } from "./components";
import { Title, Text, Link } from "@lib/components";

export default function ForgotPassword() {
	return (
		<>
			<Title order={3}>Forgot Password</Title>
			<Text>
				Please enter the email you registered with to reset your password. If you signed up via
				OAuth, refer to their guidelines instead.
			</Text>

			<ForgotPasswordForm />
			<Text>
				Go back to:{" "}
				<Link href="/auth/signup" className="text-blue-500">
					Sign In
				</Link>
			</Text>
		</>
	);
}
