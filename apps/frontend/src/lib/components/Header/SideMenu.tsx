"use client";
import { useState, useCallback, useContext, type ReactNode } from "react";
import { AuthContext, ClientContext } from "@lib/providers";
import { Image } from "@lib/components";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { Popover } from "react-tiny-popover";
import { motion } from "motion/react";
import { SideMenuButton } from "./SideMenuButton";
import { useRouter } from "next/navigation";
import type { SideMenuProps } from "./types";
import { hasPermission } from "@shared/common/abac";
import type { Action, Resource, StrictRole } from "@shared/common/types";

export function SideMenu({ navLinks }: SideMenuProps) {
	const { user, loading, signOut } = useContext(AuthContext);
	const { theme, reducedMotion, isMobile } = useContext(ClientContext);
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const checkUserPermissions = useCallback(
		(roles: StrictRole[], resource: Resource, action: Action) => {
			return roles
				.flatMap((role) => role.policies)
				.some((policy) => hasPermission(policy, resource, action));
		},
		[],
	);

	const signOutResponse = useCallback(() => {
		signOut().then((status) => {
			if (status === 204) {
				toast.success("Signed out successfully");
				router.refresh();
			} else {
				toast.error("Failed to sign out");
			}
		});
	}, [signOut, router]);

	const renderNavButtons = useCallback(() => {
		if (!isMobile) return null;
		return (
			<>
				{navLinks.map((link) => (
					<SideMenuButton
						key={link.title}
						icon="/common/link.svg"
						text={link.title}
						onClick={() => router.push(link.href)}
					/>
				))}
			</>
		);
	}, [navLinks, isMobile, router]);

	const renderAuthButtons = useCallback(() => {
		if (loading) return null;
		if (!user)
			return (
				<>
					<SideMenuButton
						icon="/common/signin.svg"
						text="Sign In"
						onClick={() => router.push("/auth/signin")}
					/>
					<SideMenuButton
						icon="/common/signin.svg"
						text="Sign Up"
						onClick={() => router.push("/auth/signup")}
					/>
				</>
			);

		return (
			<>
				<SideMenuButton
					icon="/common/settings.svg"
					text="Settings"
					onClick={() => router.push("/settings")}
				/>

				<SideMenuButton
					icon="/common/signin.svg"
					imageClassname="-scale-x-100"
					text="Sign Out"
					onClick={signOutResponse}
				/>
				<SideMenuButton
					icon="/common/link.svg"
					text="Case Form"
					onClick={() => router.push("/case-form")}
				/>
			</>
		);
	}, [user, loading, signOutResponse, router]);

	const renderRestrictedButtons = useCallback(() => {
		if (loading || !user) return null;
		const { roles } = user;
		const result: ReactNode[] = [];
		if (checkUserPermissions(roles, "allUsers", "read")) {
			result.push(
				<SideMenuButton
					key="allUsers"
					icon="/common/user.svg"
					text="Admin"
					onClick={() => router.push("/admin")}
				/>,
			);
		}
		return result;
	}, [user, loading, checkUserPermissions, router]);

	return (
		<Popover
			isOpen={open}
			positions={["bottom", "left"]}
			containerClassName="z-50"
			onClickOutside={() => setOpen(false)}
			align="end"
			padding={5}
			content={
				<motion.div
					initial={reducedMotion ? false : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-800 dark:border-gray-700"
				>
					{renderNavButtons()}

					{renderAuthButtons()}
					{renderRestrictedButtons()}
				</motion.div>
			}
		>
			<button
				onClick={() => setOpen((value) => !value)}
				className="p-2 rounded bg-zinc-200 dark:bg-zinc-800"
				data-testid="theme-toggle"
				tabIndex={-1}
				type="button"
			>
				<Image
					src="/common/burger.svg"
					alt="menu"
					className={twMerge("h6 w-6", theme === "light" ? undefined : "invert")}
					height={24}
					width={24}
				/>
			</button>
		</Popover>
	);
}
