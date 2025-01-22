import { Link } from "@lib/components";
import type { ReactNode } from "react";

export default function Layout({
	id,
	children,
}: {
	id: ReactNode;
	children: ReactNode;
}) {
	return (
		<>
			<div>{id}</div>
			<div>{children}</div>
		</>
	);
}
