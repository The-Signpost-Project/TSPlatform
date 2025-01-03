"use client";
import { useRouter } from "next/navigation";
import { Logo, Image, List, Link } from "@lib/components";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";
import { SideMenu } from "./SideMenu";

const mainNavLinks = [
	{ title: "Product", href: "/" },
	{ title: "Pricing", href: "/" },
	{ title: "Contact", href: "/" },
];

export function Header() {
	const router = useRouter();
	const { theme, setTheme, isMobile } = useContext(ClientContext);

	return (
		<header className="flex items-center justify-between p-4 border-b border-gray-800/20 dark:border-gray-50/20 sticky top-0 backdrop-blur-xl z-50">
			<div
				className="flex items-center cursor-pointer"
				onClick={() => router.push("/")}
				onKeyDown={(e) => e.key === "Enter" && router.push("/")}
			>
				<Logo />
			</div>
			<div className="flex gap-6 items-center">
				{!isMobile && (
					<List.UnorderedList className="flex list-none gap-6 px-8 border-r border-gray-800/20 dark:border-gray-50/20">
						{mainNavLinks.map((link) => (
							<List.ListItem key={link.title}>
								<Link
									href={link.href}
									className="text-gray-800 dark:text-gray-200 hover:text-slate-900 dark:hover:text-slate-50 font-semibold"
									order="sm"
									unstyled
								>
									{link.title}
								</Link>
							</List.ListItem>
						))}
					</List.UnorderedList>
				)}

				<div className="flex gap-2">
					<button
						onClick={() => {
							setTheme(theme === "light" ? "dark" : "light");
						}}
						className="p-2 rounded bg-zinc-200 dark:bg-zinc-800"
						data-testid="theme-toggle"
						tabIndex={-1}
						type="button"
					>
						{theme === "light" ? (
							<Image
								src="/common/moon.svg"
								alt="dark mode"
								className="h-6 w-6"
								height={24}
								width={24}
							/>
						) : (
							<Image
								src="/common/sun.svg"
								alt="light mode"
								className="h-6 w-6"
								height={24}
								width={24}
							/>
						)}
					</button>
					<SideMenu navLinks={mainNavLinks} />
				</div>
			</div>
		</header>
	);
}
