import { Title, Text } from "@lib/components";
import { TeamSchema, SafeUserSchema } from "@shared/common/schemas";
import { query, getSessionCookieHeader } from "@utils";
import { z } from "zod";
import { TeamTabs, AddTeam } from "./components";

const TeamsSchema = z.array(TeamSchema);
const UsersSchema = z.array(SafeUserSchema);

export default async function TeamsPage() {
	const { data: allTeamsData, error: allTeamsError } = await query({
		path: "/user/team/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: TeamsSchema,
	});

	const { data: allUsersData, error: allUsersError } = await query({
		path: "/user/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: UsersSchema,
	});

	if (!allTeamsData || allTeamsError || !allUsersData || allUsersError) {
		return (
			<div className="p-4 flex flex-col gap-1 grow">
				<Title order={2}>Teams</Title>
				<Text description>
					Teams are groups of users that are responsible for befriending peddlers in certain
					regions.
				</Text>
				<div className="mt-4">
					<Text description>There was an error fetching the teams or all users.</Text>
					<Text description>
						Error:{" "}
						{[allUsersError, allTeamsError]
							.filter(Boolean)
							.map((e) => JSON.stringify(e))
							.join(", ")}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-2 sm:p-8 p-4 grow">
			<div className="flex justify-between gap-6 sm:items-center sm:flex-row flex-col">
				<div className="flex flex-col gap-1">
					<Title order={2}>Teams</Title>
					<Text description>
						Teams are groups of users that are responsible for befriending peddlers in certain
						regions.
					</Text>
				</div>
				<AddTeam />
			</div>
			{allTeamsData.length === 0 ? (
				<div className="mt-4">
					<Text>No teams found. Add one first!</Text>
				</div>
			) : (
				<div>
					<TeamTabs teams={allTeamsData} allUsers={allUsersData} />
				</div>
			)}
		</section>
	);
}
