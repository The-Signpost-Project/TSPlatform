import { query } from "@utils";
import { z } from "zod";
import { StrictPolicySchema } from "@shared/common/schemas";
import { Text, Title } from "@lib/components";
import { getSessionCookieHeader } from "@utils";
import { AddPolicy, PolicyTable } from "./components";

const SafeUserListSchema = z.array(StrictPolicySchema);

export default async function PolicyPage() {
	const { data, error } = await query({
		path: "/role/policy/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: SafeUserListSchema,
	});
	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>Manage Policies</Title>
				<Text description>
					Manage policies that can be attached to roles. Use policies to define fine-grained
					permissions to allow actions based on resource attributes.
				</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the policies. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-4">
			<div className="flex justify-between gap-6 items-center">
				<div className="flex flex-col gap-1">
					<Title order={2}>Manage Policies</Title>
					<Text description>
						Manage policies that can be attached to roles. Use policies to define fine-grained
						permissions to allow actions based on resource attributes.
					</Text>
					<Text description>
						Click on each row to expand and manage conditions for each policy.
					</Text>
				</div>
				<AddPolicy />
			</div>

			<div className="overflow-x-auto">
				<PolicyTable policies={data} />
			</div>
		</section>
	);
}
