import { query } from "@utils";
import { z } from "zod";
import { SafeUserSchema } from "@shared/common/schemas";
import { UserTable } from "./components";
import { Text, Title } from "@lib/components";

const SafeUserListSchema = z.array(SafeUserSchema);

export default async function AdminPage() {
	const { data, error } = await query({
		path: "/user/all",
		init: {
			method: "GET",
		},
		validator: SafeUserListSchema,
	});
	if (!data || error) {
		return (
			<div>
				<Title>Admin Dashboard</Title>
				<Text>Something went wrong. Users failed to load with error: {JSON.stringify(error)}</Text>
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
