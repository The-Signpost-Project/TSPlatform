import { Card } from "@lib/components";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center h-screen sm:p-8 p-4">
			<Card className="dark:bg-zinc-950 sm:w-2/3 w-11/12">{children}</Card>
		</div>
	);
}
