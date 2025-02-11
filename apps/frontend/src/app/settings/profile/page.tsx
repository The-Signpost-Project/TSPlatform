import { Profile } from "./components";
import { Title, Text } from "@lib/components";
import { getSessionCookieHeader, query } from "@utils";
import { StrictCaseSchema } from "@shared/common/schemas";
import { z } from "zod";
import { SelfCases } from "./components";

const CasesSchema = z.array(StrictCaseSchema);

export default async function ProfilePage() {
	const { data: selfCases, error: selfCasesError } = await query({
		path: "/case/me",
		validator: CasesSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">Profile</Title>
				<Text description className="text-sm sm:text-base">
					View and manage your public profile information.
				</Text>
			</div>
			<div>
				<Profile />
				{selfCasesError || !selfCases ? (
					<div className="mt-4">
						<Text description>There was an error fetching the disabilities, regions or teams.</Text>
						<Text description>Error: {JSON.stringify(selfCasesError)}</Text>
					</div>
				) : (
					<SelfCases cases={selfCases} />
				)}
			</div>
		</div>
	);
}
