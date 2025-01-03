import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClientProvider, AuthProvider } from "@lib/providers";
import { Footer, Header } from "@lib/components";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Carbon Nexus",
	description: "Fullstack starter template",
};

const inter = Inter({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<ClientProvider>
						<main className="bg-zinc-50 dark:bg-black min-h-screen w-full transition-all">
							<Header />
							<section>{children}</section>
							<Footer />
							<Toaster
								position="bottom-right"
								toastOptions={{
									className: "!bg-zinc-100 !text-zinc-900 dark:!bg-zinc-900 dark:!text-white",
								}}
							/>
						</main>
					</ClientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
