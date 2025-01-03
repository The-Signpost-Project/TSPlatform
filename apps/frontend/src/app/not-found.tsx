import { Text, Link, Title } from "@lib/components";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center p-12 gap-6">
			<Title>404 - Page Not Found</Title>
			<Text>
				The page you are looking for might have been removed, had its name changed, or is
				temporarily unavailable.
			</Text>
			<Link href="/">Go to Home</Link>
		</div>
	);
}
