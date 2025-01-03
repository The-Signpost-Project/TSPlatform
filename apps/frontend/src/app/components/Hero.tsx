import { Title, Text, Code, Image } from "@lib/components";

export function Hero() {
	return (
		<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center ">
			<div className="animate-[pulse_5s_ease-in-out_infinite] absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_0.5px,transparent_0.5px),linear-gradient(to_bottom,#262626_0.5px,transparent_0.5px)] [mask-image:linear-gradient(20deg,rgba(255,255,255,0.05),rgba(255,255,255,0.7),rgba(255,255,255,0.05))] bg-[size:40px_40px]" />
			<div className="z-10 p-4 flex items-center">
				<div className="relative w-32 h-32 ">
					<Image src="/logo.svg" alt="Logo" />
				</div>

				<div className="flex flex-col gap-2">
					<Title className="bg-gradient-to-r from-purple-500 to-blue-700 inline-block text-transparent bg-clip-text">
						Carbon Nexus
					</Title>
					<Text>
						A modern, streamlined, and powerful boilerplate for building web applications.
					</Text>
					<Text>
						Edit <Code>apps/frontend/src/app/components/Hero.tsx</Code> to get started.
					</Text>
				</div>
			</div>
		</div>
	);
}
