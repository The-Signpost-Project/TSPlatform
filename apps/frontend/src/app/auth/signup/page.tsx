import { SignUpForm } from "./components";
import { Title, Text, Link, OAuthButton } from "@lib/components";

export default function SignIn() {
	return (
		<>
			<Title order={3}>Sign Up</Title>
			<Text>Welcome! Fill in your details to get started.</Text>
			<div className="flex w-full justify-center space-x-2">
				<OAuthButton name="Google" location="/oauth/google" iconPath="/icons/google.svg" />
			</div>

			<div className="flex flex-row flex-grow w-11/12 items-center">
				<hr className="flex-grow border-t-2 border-gray-300 dark:border-gray-700 h-1" />
				<Text className="mx-2" order="sm">
					or
				</Text>
				<hr className="flex-grow border-t-2 border-gray-300 dark:border-gray-700 h-1" />
			</div>
			<SignUpForm />
			<Text>
				Already have an account?{" "}
				<Link href="/auth/signin" className="text-blue-500">
					Sign in
				</Link>
			</Text>
		</>
	);
}
