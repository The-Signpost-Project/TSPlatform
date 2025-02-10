"use client";
import type { TeamContentProps } from "./types";
import { Button, Text, TextInput } from "@lib/components";
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
		console.log(user.id, user.isMember);
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
					toast.error(result.error?.cause || "An error occurred");
				});
			});
      return
		}
		// else add user to team

		startTransition(async () => {
			const result = await addMemberToTeam(team.id, user.id);

			startTransition(() => {
				console.log(result);
				if (result.status === 201) {
					toast.success(`Added ${user.username} to ${team.name}`);
					router.refresh();
          return;
				}
				toast.error(result.error?.cause || "An error occurred");
			});
		});
	};

	return (
		<div className="flex flex-col gap-2 flex-grow">
			{isEditing ? (
				<div className="flex flex-col gap-1">
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
				<Button onClick={() => setIsEditing(true)}>Manage members in {team.name}</Button>
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
