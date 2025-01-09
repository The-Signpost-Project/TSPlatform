import { Text, Link, Title } from "@lib/components";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center sm:p-24 p-12 gap-6">
			<Title>403 - Forbidden</Title>
			<Text>
				The page you are looking for exists, but you do not have the correct permissions to view it.
				Contact the administrator if you believe this is a mistake.
			</Text>
			<Link href="/">Go to Home</Link>
		</div>
	);
}
