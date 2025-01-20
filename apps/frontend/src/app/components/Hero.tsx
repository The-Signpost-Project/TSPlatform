import { Title, Text, Link, Logo } from "@lib/components";
import { getUser } from "@lib/actions";

export async function Hero() {
	const { data: user } = await getUser();
	return (
		<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center ">
			<div className="animate-[pulse_5s_ease-in-out_infinite] absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_0.5px,transparent_0.5px),linear-gradient(to_bottom,#262626_0.5px,transparent_0.5px)] [mask-image:linear-gradient(20deg,rgba(255,255,255,0.05),rgba(255,255,255,0.7),rgba(255,255,255,0.05))] bg-[size:40px_40px]" />
			<div className="z-10 p-4 flex flex-col sm:flex-row items-center">
				<Logo className="relative w-64 h-64 sm:w-32 sm:h-32" />

				<div className="flex flex-col gap-2">
					<Title className="bg-gradient-to-r from-orange-400 to-red-700 inline-block text-transparent bg-clip-text">
						TSPlatform
					</Title>
					<div>
						<Text order="lg">
							The Signpost Project's internal platform to handle peddlers and their data.
						</Text>
						{user === null ? (
							<Text order="lg">
								<span>
									<Link href="/auth/signin">Sign In</Link>
								</span>{" "}
								to get started.
							</Text>
						) : (
							<div className="flex flex-col">
								<Text order="lg">
									You are signed in as <span className="font-semibold">{user?.username}</span>.
								</Text>
								<Text order="lg">
									Submit a <Link href="/case-form">new case</Link> or{" "}
									<Link href="/cases">view cases</Link>.
								</Text>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
