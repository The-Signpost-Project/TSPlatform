"use client";
import { Sidebar, SidebarItem } from "@lib/components";
import { usePathname } from "next/navigation";

const iconClasses =
	"w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";

const activeIconClasses = "w-5 h-5 text-orange-500 transition duration-75 dark:text-orange-400";

const navLinks = {
	"/admin": {
		name: "Users",
		icon: (styles: string) => (
			<svg
				className={styles}
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 24 24"
				role="img"
				aria-label="Users"
			>
				<path
					fillRule="evenodd"
					d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	"/admin/roles": {
		name: "Roles",
		icon: (styles: string) => (
			<svg
				className={styles}
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 24 24"
				role="img"
				aria-label="Roles"
			>
				<path
					fillRule="evenodd"
					d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	"/admin/policies": {
		name: "Policies",
		icon: (styles: string) => (
			<svg
				className={styles}
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 24 24"
				role="img"
				aria-label="Policies"
			>
				<path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z" />
				<path
					fillRule="evenodd"
					d="M11 7V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm4.707 5.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
};

export function SidebarNav() {
	const pathname = usePathname();

	return (
		<Sidebar>
			{Object.entries(navLinks).map(([path, { name, icon }]) => (
				<SidebarItem href={path} key={path} active={pathname === path}>
					{icon(pathname === path ? activeIconClasses : iconClasses)}
					<span className="ms-3 hidden sm:block">{name}</span>
				</SidebarItem>
			))}
		</Sidebar>
	);
}
