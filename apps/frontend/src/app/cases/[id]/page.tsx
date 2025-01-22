import { CaseOverlay } from "../components";
import CasesPage from "../page";

export default async function CaseIdPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;
	return (
		<>
			<CaseOverlay routerAction="push" caseId={id} />
			<CasesPage />
		</>
	);
}
