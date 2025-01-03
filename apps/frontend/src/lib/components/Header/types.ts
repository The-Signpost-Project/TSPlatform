export interface SideMenuButtonProps {
	icon: string;
	text: string;
	imageClassname?: string;
	onClick: () => void;
}

export interface SideMenuProps {
	navLinks: { title: string; href: string }[];
}
