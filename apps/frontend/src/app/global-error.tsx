"use client";
import { Text, Title, Link } from "@lib/components";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
	return (
		<html lang="en">
			<body>
				<div className="flex flex-col items-center sm:p-24 p-12 gap-6">
					<Title>500 - Internal Server Error</Title>
					<Text>{error.message}</Text>
					<Text description>{error.digest}</Text>
					<Link href="/">Go to Home</Link>
				</div>
			</body>
		</html>
	);
}
