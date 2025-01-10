import { query } from "@utils";
import { z } from "zod";
import { SafeUserSchema, StrictRoleSchema } from "@shared/common/schemas";
import { UserTable } from "./components";
import { Text, Title } from "@lib/components";
import { getSessionCookieHeader } from "@utils";

const SafeUserListSchema = z.array(SafeUserSchema);
const StrictRolesSchema = z.array(StrictRoleSchema);

export default async function AdminPage() {
	const { data, error } = await query({
		path: "/user/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: SafeUserListSchema,
	});
	const { data: roleData } = await query({
		path: "/role/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: StrictRolesSchema,
	});

	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>Manage Users</Title>
				<Text description>Manage users and their roles here.</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the users. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">Manage Users</Title>
				<Text description className="text-sm sm:text-base">
					Manage users and their roles here.
				</Text>
			</div>

			<div className="overflow-x-auto">
				{roleData && (
					<UserTable
						users={data}
						allRoles={roleData.map((role) => ({
							id: role.id,
							name: role.name,
						}))}
					/>
				)}
			</div>
		</section>
	);
}
