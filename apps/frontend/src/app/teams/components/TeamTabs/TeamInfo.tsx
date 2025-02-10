import type { TeamInfoProps } from "./types";
import { Text, Image, Title } from "@lib/components";
import { EditTeam } from "../EditTeam";
import { DeleteTeam } from "../DeleteTeam";

export function TeamInfo({ team }: TeamInfoProps) {
	return (
		<div>
			<div className="relative min-w-64 h-64">
				<Image src={team.photoPath ?? "/common/empty-image.png"} alt={`Team ${team.name} photo`} />
			</div>
			<Title order={6}>Team {team.name}</Title>
			<Text description order="sm">
				{team.id}
			</Text>
			<Text description order="sm">
				{team.members.length} members
			</Text>
			<div className="flex gap-2 w-full">
				<EditTeam team={team} />
				<DeleteTeam team={team} />
			</div>
		</div>
	);
}
