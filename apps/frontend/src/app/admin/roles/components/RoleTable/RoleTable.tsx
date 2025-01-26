"use client";
import { Table, Text, Pill } from "@lib/components";
import type { RoleTableProps } from "./types";
import { DeleteRole } from "../DeleteRole";
import { EditRole } from "../EditRole";

export function RoleTable({ roles, allPolicies }: RoleTableProps) {
	return (
		<Table.Table>
			<Table.TableHead>
				<Table.TableRow>
					<Table.TableHeader>Name</Table.TableHeader>
					<Table.TableHeader>Policies</Table.TableHeader>
					<Table.TableHeader>Actions</Table.TableHeader>
				</Table.TableRow>
			</Table.TableHead>
			<Table.TableBody>
				{roles.map((role) => (
					<Table.TableRow key={role.id}>
						<Table.TableCell>
							<Text>{role.name}</Text>
							<Text description order="xs">
								{role.id}
							</Text>
						</Table.TableCell>
						<Table.TableCell>
							<div className="flex flex-wrap gap-1">
								{role.policies.map((p) => (
									<Pill key={p.id} color="info">
										{p.name}
									</Pill>
								))}
							</div>
						</Table.TableCell>
						<Table.TableCell>
							<div className="flex gap-2">
								<EditRole
									name={role.name}
									id={role.id}
									policies={allPolicies.map((p) => ({
										id: p.id,
										name: p.name,
										selected: role.policies.some((rp) => rp.id === p.id),
									}))}
								/>
								<DeleteRole name={role.name} id={role.id} />
							</div>
						</Table.TableCell>
					</Table.TableRow>
				))}
			</Table.TableBody>
		</Table.Table>
	);
}
