import type { TeamInfoProps } from "./types";
import { Text, Image, Title, Button } from "@lib/components";
import { EditTeam } from "../EditTeam";
import { DeleteTeam } from "../DeleteTeam";

export function TeamInfo({ team }: TeamInfoProps) {
	return (
		<div className="flex flex-col gap-2 md:w-64 w-full">
			<div className="relative min-w-64 h-64">
				<Image src={team.photoPath ?? "/common/empty-image.png"} alt={`Team ${team.name} photo`} />
			</div>
			<div className="flex flex-col gap-0.5">
				<Title order={6}>Team {team.name}</Title>
				<Text description order="sm">
					{team.id}
				</Text>
				<Text description order="sm">
					{team.members.length} members
				</Text>
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex gap-2 w-full">
					<EditTeam team={team} />
					<DeleteTeam team={team} />
				</div>
				<Button href={`/cases?teamName=${team.name}`} className="w-full">
					View Cases
				</Button>
			</div>
		</div>
	);
}
