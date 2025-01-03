import { SignInForm } from "./components";
import { Title, Text, Link, OAuthButton } from "@lib/components";

export default function SignIn() {
	return (
		<>
			<Title order={3}>Sign In</Title>
			<Text>Welcome back! Please sign in to continue.</Text>
			<div className="flex flex-wrap w-full gap-1">
				<OAuthButton name="Discord" location="/oauth/discord" iconPath="/icons/discord.svg" />
				<OAuthButton name="Google" location="/oauth/google" iconPath="/icons/google.svg" />
				<OAuthButton name="GitHub" location="/oauth/github" iconPath="/icons/github.svg" />
			</div>

			<div className="flex flex-row flex-grow w-11/12 items-center">
				<hr className="flex-grow border-t-2 border-gray-300 dark:border-gray-700 h-1" />
				<Text className="mx-2" order="sm">
					or
				</Text>
				<hr className="flex-grow border-t-2 border-gray-300 dark:border-gray-700 h-1" />
			</div>
			<SignInForm />
			<div className="flex flex-col gap-2">
				<Text>
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-blue-500">
						Sign up
					</Link>
				</Text>
				<Text>
					Forgot your password?{" "}
					<Link href="/auth/forgot-password" className="text-blue-500">
						Reset it
					</Link>
				</Text>
			</div>
		</>
	);
}
