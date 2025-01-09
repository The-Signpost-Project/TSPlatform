import { query } from "@utils";
import { z } from "zod";
import { StrictRoleSchema, StrictPolicySchema } from "@shared/common/schemas";
import { RoleTable, AddRole } from "./components";
import { Text, Title } from "@lib/components";
import { getSessionCookieHeader } from "@utils";

const StrictRolesSchema = z.array(StrictRoleSchema);
const StrictPolicyListSchema = z.array(StrictPolicySchema);

export default async function RolePage() {
	const { data, error } = await query({
		path: "/role/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: StrictRolesSchema,
	});

	const { data: policies } = await query({
		path: "/role/policy/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: StrictPolicyListSchema,
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
			<div className="flex justify-between gap-6 items-center">
				<div className="flex flex-col gap-1">
					<Title order={2}>Manage Roles</Title>
					<Text description>
						Manage roles and attach policies onto them. Use roles to group users and give them
						permissions to perform actions around the app.
					</Text>
				</div>
				{policies && <AddRole policies={policies?.map((p) => ({ name: p.name, id: p.id }))} />}
			</div>

			<div className="overflow-x-auto">
				{policies && <RoleTable roles={data} allPolicies={policies} />}
			</div>
		</section>
	);
}
