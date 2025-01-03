"use client";
import { Image, Title } from "@lib/components";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";

const relPath = "/techstack";
const techStack = [
	"/bun.svg",
	"/nestjs.svg",
	"/nextjs.svg",
	"/tailwind.svg",
	"/typescript.svg",
	"/prisma.svg",
	"/turborepo.svg",
];

export function TechStack() {
	const { reducedMotion, isMobile } = useContext(ClientContext);

	return (
		<article className="flex flex-col gap-4 items-center mt-32">
			<Title order={2}>Built With</Title>
			{reducedMotion || isMobile ? (
				<div className="flex flex-col gap-4 items-center overflow-scroll w-full">
					<div className="flex gap-4">
						{techStack.map((src) => (
							<Image key={src} src={relPath + src} alt={src} width={100} height={100} />
						))}
					</div>
				</div>
			) : (
				<div className="relative flex overflow-x-hidden w-full">
					<div className="py-12 animate-marquee whitespace-nowrap flex">
						{techStack.map((src) => (
							<Image
								key={src}
								src={relPath + src}
								alt={src}
								width={100}
								height={100}
								className="mx-4"
							/>
						))}
					</div>

					<div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap flex">
						{techStack.map((src) => (
							<Image
								key={`2-${src}`}
								src={relPath + src}
								alt={src}
								width={100}
								height={100}
								className="mx-4"
							/>
						))}
					</div>
				</div>
			)}
		</article>
	);
}
