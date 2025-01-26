import { PeddlerOverlay } from "../../components";

export default async function CaseIdPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;
	return <PeddlerOverlay routerAction="back" peddlerId={id} />;
}
