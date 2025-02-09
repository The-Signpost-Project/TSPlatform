import { Text, Link, Title, Code } from "@lib/components";

export default async function NotFound({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const missing = (await searchParams).missing; // a list of missing permissions
	return (
		<div className="flex flex-col items-center sm:p-24 p-12 gap-6">
			<Title>403 - Forbidden</Title>
			<Text>
				The page you are looking for exists, but you do not have the correct permissions to view it.
				Contact the administrator if you believe this is a mistake.
			</Text>
			{missing &&
				(Array.isArray(missing) ? (
					<Text>
						Missing <Code>read</Code> permissions: <Code>{missing.join(", ")}</Code>
					</Text>
				) : (
					<Text>
						Missing <Code>read</Code> permissions: <Code>{missing}</Code>
					</Text>
				))}
			<Link href="/">Go to Home</Link>
		</div>
	);
}
