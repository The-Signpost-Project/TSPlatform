import { getDisabilities } from "./actions";
import { Suspense } from "react";
import { Loader } from "@lib/components";
import { ManageDisabilities } from "./ManageDisabilities";

export function ManageDisabilitiesWrapper() {
	const promise = getDisabilities();
	return (
		<Suspense fallback={<Loader />}>
			<ManageDisabilities disabilities={promise} />
		</Suspense>
	);
}
