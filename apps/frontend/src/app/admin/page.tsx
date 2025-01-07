import { query } from "@utils";
import { z } from "zod";
import { SafeUserSchema } from "@shared/common/schemas";
import { UserTable } from "./components";
import { Text, Title } from "@lib/components";
import { getSessionCookieHeader } from "@utils";

const SafeUserListSchema = z.array(SafeUserSchema);

export default async function AdminPage() {
	const { data, error } = await query({
		path: "/user/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: SafeUserListSchema,
	});
	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>Admin Dashboard</Title>
				<Text description>Manage users and roles here.</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the users. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="p-4 flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title order={2}>Admin Dashboard</Title>
				<Text description>Manage users and roles here.</Text>
			</div>

			<div className="overflow-x-auto">
				<UserTable users={data} />
			</div>
		</section>
	);
}
