import { Text, Link } from "@lib/components";

export function Footer() {
	return (
		<footer>
			<div className="flex flex-col justify-center items-center p-6 mt-32">
				<Text className="text-zinc-600 dark:text-zinc-300">
					Made with ❤️ © SebassNoob {new Date().getFullYear()}
				</Text>
				<Link href="https://github.com/SebassNoob/carbon-nexus" external>
					Source Code
				</Link>
			</div>
		</footer>
	);
}
