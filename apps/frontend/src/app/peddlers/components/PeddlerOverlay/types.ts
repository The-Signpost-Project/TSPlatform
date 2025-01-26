export interface PeddlerOverlayProps {
	routerAction: "back" | "push"; // specific prop to tell nextjs to push /cases or go back
	peddlerId: string;
}
