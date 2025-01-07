import { Text, Link, Title } from "@lib/components";

export function Footer() {
	return (
		<footer>
			<div className="flex flex-col justify-center items-center px-16 pt-12 pb-4 mt-2 border-t-2 border-zinc-200 dark:border-zinc-700">
				<section className="flex items-center justify-center mb-4">
					<div className="flex flex-col gap-2 items-center w-1/3 mr-24">
						<Title order={6}>The Signpost Project, Singapore</Title>

						<Text description order="sm">
							The Signpost Project aims to nurture relationships and articulate individual stories
							of tissue peddlers in Singapore. We conduct regular visits to tissue peddlers across
							the country to chat with them, check on how they are, and see how we can help.​
						</Text>
					</div>
					<div className="flex flex-col gap-2 w-1/5">
						<Title order={6}>Follow us!</Title>

						<Link href="mailto:signpostprojectsg@gmail.com">Email</Link>
						<Link
							href="https://www.linkedin.com/company/the-signpost-project/?originalSubdomain=sg"
							external
						>
							Linkedin
						</Link>
						<Link href="https://www.facebook.com/thesignpostproject/" external>
							Facebook
						</Link>
						<Link href="https://www.instagram.com/thesignpostproject/" external>
							Instagram
						</Link>
					</div>
					<div className="flex flex-col gap-2  w-1/5">
						<Title order={6}>Resources</Title>
						<Link href="https://www.thesignpostproject.org/" external>
							Main website
						</Link>
						<Link href="/">Legitimate Interests Exceptions</Link>
					</div>
				</section>

				<Text className="text-zinc-600 dark:text-zinc-300">
					© The Signpost Project, {new Date().getFullYear()}
				</Text>
			</div>
		</footer>
	);
}
