export interface CaseOverlayProps {
	routerAction: "back" | "push"; // specific prop to tell nextjs to push /cases or go back
	caseId: string;
}
