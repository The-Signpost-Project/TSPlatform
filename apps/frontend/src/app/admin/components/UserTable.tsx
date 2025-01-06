"use client";
import { Table, Text } from "@lib/components";
import type { UserTableProps } from "./types";

// TODO: add role editing, delete user

export function UserTable({ users }: UserTableProps) {
	return (
		<Table.Table className="overflow-x-auto">
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
							<Text>
								{user.roles.reduce((prev, role) => {
									return `${prev + role.name},`;
								}, "")}
							</Text>
						</Table.TableCell>
						<Table.TableCell>
							<Text>{new Date(user.createdAt).toLocaleString("en-br")}</Text>
						</Table.TableCell>
						<Table.TableCell>
							<Text>{user.verified ? "Yes" : "No"}</Text>
						</Table.TableCell>
					</Table.TableRow>
				))}
			</Table.TableBody>
		</Table.Table>
	);
}
