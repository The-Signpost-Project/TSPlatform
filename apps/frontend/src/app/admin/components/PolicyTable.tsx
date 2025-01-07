"use client";
import { Table } from "@lib/components";
import type { PolicyTableProps } from "./types";

// TODO: add role editing, delete user

export function PolicyTable({ policies }: PolicyTableProps) {
	return (
		<Table.Table>
			<Table.TableHead>
				<Table.TableRow>
					<Table.TableHeader>Name</Table.TableHeader>
					<Table.TableHeader>Action</Table.TableHeader>
					<Table.TableHeader>Resource</Table.TableHeader>
					<Table.TableHeader>Conditions</Table.TableHeader>
				</Table.TableRow>
			</Table.TableHead>
			<Table.TableBody>
				<></>
			</Table.TableBody>
		</Table.Table>
	);
}
