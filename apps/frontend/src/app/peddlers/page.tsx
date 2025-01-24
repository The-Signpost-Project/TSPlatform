import { AddPeddler, PeddlerCard } from "./components";
import { Title, Text } from "@lib/components";
import { PeddlerSchema } from "@shared/common/schemas";
import { query, getSessionCookieHeader } from "@utils";
import { z } from "zod";

const PeddlersSchema = z.array(PeddlerSchema);

export default async function RegionPage() {
	const { data, error } = await query({
		path: "/peddler/all",
		init: {
			method: "GET",
			headers: await getSessionCookieHeader(),
		},
		validator: PeddlersSchema,
	});

	if (!data || error) {
		return (
			<div className="p-4 flex flex-col gap-1">
				<Title order={2}>Peddlers</Title>
				<Text description>Manage the profiles and cases linked to tissue sellers.</Text>
				<div className="mt-4">
					<Text description>
						There was an error fetching the peddlers. Error: {JSON.stringify(error)}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-2 sm:p-8 p-4">
			<div className="flex justify-between gap-6 sm:items-center sm:flex-row flex-col">
				<div className="flex flex-col gap-1">
					<Title order={2}>Peddlers</Title>
					<Text description>Manage the profiles and cases linked to tissue sellers.</Text>
				</div>
				<AddPeddler />
			</div>

			<div className="flex flex-col gap-4">
				{Object.entries(Object.groupBy(data, (peddler) => peddler.mainRegion.name)).map(
					([region, peddlers]) => {
						if (peddlers && peddlers.length > 0)
							return (
								<div key={region} className="flex flex-col gap-2">
									<Title order={3}>{region}</Title>
									<div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
										{peddlers.map((peddler) => (
											<PeddlerCard key={peddler.id} data={peddler} />
										))}
									</div>
								</div>
							);
						return null;
					},
				)}
			</div>
		</section>
	);
}
