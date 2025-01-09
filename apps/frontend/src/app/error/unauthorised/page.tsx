import { Text, Link, Title } from "@lib/components";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center sm:p-24 p-12 gap-6">
			<Title>401 - Unauthorised</Title>
			<Text>
				The page you are looking for exists, but you must be signed in with the correct permissions
				to use it.
			</Text>
			<Link href="/">Go to Home</Link>
			<Link href="/auth/signin">Sign In</Link>
		</div>
	);
}
