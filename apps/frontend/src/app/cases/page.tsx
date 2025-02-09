import { Title, Text } from "@lib/components";
import { CaseFilters } from "./components";
import { query } from "@utils";
import { z } from "zod";
import { getSessionCookieHeader } from "@utils";
import { RegionSchema, PeddlerSchema, TeamSchema } from "@shared/common/schemas";

const RegionsSchema = z.array(RegionSchema);
const PeddlersSchema = z.array(PeddlerSchema);
const TeamsSchema = z.array(TeamSchema);

export default async function CasesPage() {
	const { data: allRegions, error: fetchRegionsError } = await query({
		path: "/peddler/region/all",
		validator: RegionsSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});

	const { data: allPeddlers, error: fetchPeddlersError } = await query({
		path: "/peddler/all",
		validator: PeddlersSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});

	const { data: allTeams, error: fetchTeamsError } = await query({
		path: "/user/team/all",
		validator: TeamsSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});

	if (
		!allRegions ||
		fetchRegionsError ||
		!allPeddlers ||
		fetchPeddlersError ||
		!allTeams ||
		fetchTeamsError
	) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title className="text-xl sm:text-3xl">Cases</Title>
				<Text description className="text-sm sm:text-base">
					Search for encounters with tissue peddlers here.
				</Text>
				<div className="mt-4">
					<Text description>There was an error fetching the disabilities, regions or teams.</Text>
					<Text description>
						Error:{" "}
						{[fetchRegionsError, fetchPeddlersError, fetchTeamsError]
							.filter(Boolean)
							.map((e) => JSON.stringify(e))
							.join(", ")}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="p-4 sm:p-8 flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-xl sm:text-3xl">Cases</Title>
				<Text description className="text-sm sm:text-base">
					Search for encounters with tissue peddlers here.
				</Text>
			</div>
			<CaseFilters allRegions={allRegions} allPeddlers={allPeddlers} allTeams={allTeams} />
		</section>
	);
}
