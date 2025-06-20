import { CaseOverlay } from "../../components";

export default async function CaseIdPage({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	return <CaseOverlay routerAction="back" caseId={id} />;
}
