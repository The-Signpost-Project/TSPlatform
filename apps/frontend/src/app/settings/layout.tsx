import type { ReactNode } from "react";
import { SidebarSettingsNav } from "./components";

export default function SettingsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex grow">
			<SidebarSettingsNav />
			<div className="p-4 sm:p-8 overflow-auto w-full">{children}</div>
		</div>
	);
}
