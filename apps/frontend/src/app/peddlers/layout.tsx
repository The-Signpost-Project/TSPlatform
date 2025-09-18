import type { ReactNode } from "react";

export default function Layout({ id, children }: { id: ReactNode; children: ReactNode }) {
	return (
		<div className="grow">
			{id}
			{children}
		</div>
	);
}
