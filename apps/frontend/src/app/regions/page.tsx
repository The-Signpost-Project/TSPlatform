import { AddRegion, RegionCard } from "./components";
import { Title, Text } from "@lib/components";
import { RegionSchema } from "@shared/common/schemas";
import { query, getSessionCookieHeader } from "@utils";
import { z } from "zod";

const RegionsSchema = z.array(RegionSchema);

export default async function RegionPage() {
	const { data, error } = await query({
		path: "/peddler/region/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: RegionsSchema,
	});

	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1 flex-grow">
				<Title order={2}>Regions</Title>
				<Text description>Regions are real-world locations where peddlers are located.</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the regions. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-2 sm:p-8 p-4 flex-grow">
			<div className="flex justify-between gap-6 sm:items-center sm:flex-row flex-col">
				<div className="flex flex-col gap-1">
					<Title order={1}>Regions</Title>
					<Text description>
						Regions are real-world locations where peddlers are located. Eg. "Clementi", "Changi",
						"Pulau Tekong".
					</Text>
				</div>
				<AddRegion />
			</div>

			<div className="grid lg:grid-cols-4 lg:gap-4 sm:grid-cols-2 grid-cols-1 gap-2 ">
				{data?.map((region) => (
					<RegionCard key={region.id} region={region} />
				))}
			</div>
		</section>
	);
}
