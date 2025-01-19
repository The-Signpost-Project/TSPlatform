import { DateInput, Title, Text } from "@lib/components";
import { CaseForm } from "./components";
import { query } from "@utils";
import { z } from "zod";
import { DisabilitySchema, RegionSchema } from "@shared/common/schemas";
import { getSessionCookieHeader } from "@utils";

const DisabilitiesSchema = z.array(DisabilitySchema);
const RegionsSchema = z.array(RegionSchema);

export default async function CaseFormPage() {
	const { data: allDisabilities, error: fetchDisabilitiesError } = await query({
		path: "/peddler/disability/all",
		validator: DisabilitiesSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});
	const { data: allRegions, error: fetchRegionsError } = await query({
		path: "/peddler/region/all",
		validator: RegionsSchema,
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
	});

	if (!allDisabilities || fetchDisabilitiesError || !allRegions || fetchRegionsError) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>The Signpost Project Combined Case Form</Title>
				<Text description>Manage users and their roles here.</Text>
				<div className="mt-4">
					<Text description>There was an error fetching the disabilities or regions.</Text>
					<Text description>
						Error: {JSON.stringify(fetchDisabilitiesError || fetchRegionsError)}
					</Text>
				</div>
			</div>
		);
	}

	console.log(allDisabilities, allRegions);
	return (
		<section className="p-4 sm:p-8 flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-xl sm:text-3xl">The Signpost Project Combined Case Form</Title>
				<Text description className="text-sm sm:text-base">
					Please fill this in to the best of your ability!
				</Text>
			</div>
			<CaseForm allDisabilities={allDisabilities} allRegions={allRegions} />
		</section>
	);
}
