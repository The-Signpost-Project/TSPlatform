import { Title, Text } from "@lib/components";
import { CaseGrid } from "./components";

import { fetchCases } from "./components/CaseGrid/actions";

export default function CasesPage() {
	return (
		<section className="p-4 sm:p-8 flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-xl sm:text-3xl">Cases</Title>
				<Text description className="text-sm sm:text-base">
					Search for encounters with tissue peddlers here.
				</Text>
			</div>
			<CaseGrid data={fetchCases({})} />
		</section>
	);
}
