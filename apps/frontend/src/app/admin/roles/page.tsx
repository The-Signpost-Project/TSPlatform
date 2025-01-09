import { query } from "@utils";
import { z } from "zod";
import { StrictRoleSchema } from "@shared/common/schemas";
import { RoleTable } from "./components";
import { Text, Title } from "@lib/components";
import { getSessionCookieHeader } from "@utils";

const SafeUserListSchema = z.array(StrictRoleSchema);

export default async function RolePage() {
	const { data, error } = await query({
		path: "/role/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: SafeUserListSchema,
	});
	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>Manage Roles</Title>
				<Text description>
					Manage roles and attach policies onto them. Use roles to group users and give them
					permissions to perform actions around the app.
				</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the roles. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title order={2}>Manage Roles</Title>
				<Text description>
					Manage roles and attach policies onto them. Use roles to group users and give them
					permissions to perform actions around the app.
				</Text>
			</div>

			<div className="overflow-x-auto">
				<RoleTable roles={data} />
			</div>
		</section>
	);
}
