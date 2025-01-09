"use client";
import { Table, Text, Pill } from "@lib/components";
import type { RoleTableProps } from "./types";
import { DeleteRole } from "../DeleteRole";

// TODO: add role editing, delete user

export function RoleTable({ roles }: RoleTableProps) {
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
							{role.policies.map((p) => (
								<Pill key={p.id} color="info" className="mr-1">
									{p.name}
								</Pill>
							))}
						</Table.TableCell>
            <Table.TableCell>
              <DeleteRole name={role.name} id={role.id} />
            </Table.TableCell>

					</Table.TableRow>
				))}
			</Table.TableBody>
		</Table.Table>
	);
}
