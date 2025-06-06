"use client";
import { Table, Text, Pill } from "@lib/components";
import type { UserTableProps } from "./types";
import { BooleanText } from "../BooleanText";
import { EditUserRole } from "../EditUserRole";

export function UserTable({ users, allRoles }: UserTableProps) {
	return (
		<Table.Table>
			<Table.TableHead>
				<Table.TableRow>
					<Table.TableHeader>Name</Table.TableHeader>
					<Table.TableHeader>Email</Table.TableHeader>
					<Table.TableHeader>Roles</Table.TableHeader>
					<Table.TableHeader>Created At</Table.TableHeader>
					<Table.TableHeader>Verified</Table.TableHeader>
					<Table.TableHeader>Actions</Table.TableHeader>
				</Table.TableRow>
			</Table.TableHead>
			<Table.TableBody>
				{users.map((user) => (
					<Table.TableRow key={user.id}>
						<Table.TableCell>
							<Text>{user.username}</Text>
						</Table.TableCell>
						<Table.TableCell>
							<Text>{user.email}</Text>
						</Table.TableCell>
						<Table.TableCell>
							<div className="flex flex-wrap gap-1">
								{user.roles.map((r) => (
									<Pill key={r.id} color="info" className="mr-1">
										{r.name}
									</Pill>
								))}
							</div>
						</Table.TableCell>
						<Table.TableCell>
							<Text>{new Date(user.createdAt).toLocaleString("en-br")}</Text>
						</Table.TableCell>
						<Table.TableCell>
							<BooleanText value={user.verified} />
						</Table.TableCell>
						<Table.TableCell>
							<EditUserRole
								roles={allRoles.map((role) => ({
									id: role.id,
									name: role.name,
									selected: user.roles.some((ur) => ur.id === role.id),
								}))}
								id={user.id}
								name={user.username}
							/>
						</Table.TableCell>
					</Table.TableRow>
				))}
			</Table.TableBody>
		</Table.Table>
	);
}
