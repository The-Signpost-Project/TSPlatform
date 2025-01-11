import { AddRegion } from "./components";
import { Title, Text } from "@lib/components";

export default function RegionPage() {
	return (
		<section className="flex flex-col gap-2 sm:p-8 p-4">
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
			<div className="grid grid-cols-4 gap-4">{null}</div>
		</section>
	);
}
