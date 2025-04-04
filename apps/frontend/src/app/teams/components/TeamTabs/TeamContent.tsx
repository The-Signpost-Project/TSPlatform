"use client";
import type { TeamContentProps } from "./types";
import { Button, Text, TextInput, Title } from "@lib/components";
import { useState, useTransition } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { addMemberToTeam, removeMemberFromTeam } from "./actions";
import { toast } from "react-hot-toast";
import type { SafeUser } from "@shared/common/types";

export function TeamContent({ team, allUsers }: TeamContentProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [search, setSearch] = useState("");
	const filteredUsers = allUsers
		// Filter users by search
		.filter((user) => user.username.includes(search))
		// Map users to include isMember property
		.map((user) => ({
			...user,
			isMember: team.members.some((member) => member.username === user.username),
		}))
		// Sort users by isMember
		.sort((a, b) => (a.isMember === b.isMember ? 0 : a.isMember ? -1 : 1));
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const selectUserCb = (user: SafeUser & { isMember: boolean }) => {
		if (isPending) return;
		if (user.isMember) {
			// Remove user from team
			startTransition(async () => {
				const result = await removeMemberFromTeam(team.id, user.id);

				startTransition(() => {
					if (result.status === 200) {
						toast.success(`Removed ${user.username} from ${team.name}`);
						router.refresh();
						return;
					}
					toast.error(result.error?.cause ?? "Failed to remove user from team");
				});
			});
			return;
		}
		// else add user to team

		startTransition(async () => {
			const result = await addMemberToTeam(team.id, user.id);

			startTransition(() => {
				if (result.status === 201) {
					toast.success(`Added ${user.username} to ${team.name}`);
					router.refresh();
					return;
				}
				toast.error(result.error?.cause ?? "Failed to add user to team");
			});
		});
	};

	return (
		<div className="flex flex-col gap-2 flex-grow mt-1">
			<hr className="border-t-2 border-gray-300 dark:border-gray-700 h-1 md:hidden" />
			{isEditing ? (
				<div className="flex flex-col gap-1">
					<Title order={6} className="text-base">
						Team {team.name} members
					</Title>
					<div className="flex gap-2 justify-between items-end">
						<TextInput
							label="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search for a user"
							className="w-full"
						/>
						<Button
							onClick={() => setIsEditing(false)}
							className="h-10 flex items-center justify-center"
							color="success"
							variant="outlined"
						>
							Done
						</Button>
					</div>
					<Text description order="sm">
						Click greyed-out users to add to this team, or click fully opaque users in the team to
						remove them.
					</Text>
				</div>
			) : (
				<div className="flex gap-2 justify-between items-center">
					<Title order={6} className="text-base">
						Team {team.name} members
					</Title>
					<Button onClick={() => setIsEditing(true)} variant="outlined">
						Manage
					</Button>
				</div>
			)}
			{isEditing ? (
				<>
					{filteredUsers.map((user) => (
						<div
							className={twMerge(
								"px-2 py-1.5 rounded w-full cursor-pointer",
								user.isMember
									? "bg-gray-200 dark:bg-gray-800"
									: "bg-gray-200/50 dark:bg-gray-800/50",
								isPending ? "animate-pulse" : "",
							)}
							key={user.id}
							onClick={() => selectUserCb(user)}
							onKeyDown={() => selectUserCb(user)}
						>
							<Text
								className={twMerge(
									user.isMember ? "" : "opacity-60",
									isPending ? "animate-pulse" : "",
								)}
							>
								{user.username}
							</Text>
						</div>
					))}
				</>
			) : (
				<>
					{team.members.length === 0 && (
						<Text description order="sm">
							This team has no members. Click the "Manage" button to add members.
						</Text>
					)}

					{team.members.map((member) => (
						<div
							className="bg-gray-200 dark:bg-gray-800 px-2 py-1.5 rounded w-full"
							key={member.id}
						>
							<Text>{member.username}</Text>
						</div>
					))}
				</>
			)}
		</div>
	);
}
