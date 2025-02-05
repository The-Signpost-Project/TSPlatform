import type { ReactNode } from "react";
import { SidebarNav } from "./components";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-grow">
			<SidebarNav />
			<div className="p-4 sm:p-8 overflow-auto">{children}</div>
		</div>
	);
}
