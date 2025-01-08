"use client";
import { List, Table, Text } from "@lib/components";
import type { PolicyTableProps } from "./types";
import { CollapsibleRow } from "./CollapsibleRow";
import { BooleanText } from "../BooleanText";
import type { StrictCondition } from "@shared/common/types";

// TODO: add role editing, delete user

const operatorMapping: Record<StrictCondition["operator"], string> = {
	eq: "equals",
	ne: "does not equal",
	gt: "is greater than",
	lt: "is less than",
	gte: "is greater than or equal to",
	lte: "is less than or equal to",
	in: "is in",
	nin: "is not in",
	contains: "contains",
	startsWith: "starts with",
	endsWith: "ends with",
};

export function PolicyTable({ policies }: PolicyTableProps) {
	return (
		<Table.Table>
			<Table.TableHead>
				<Table.TableRow>
					<Table.TableHeader>Name</Table.TableHeader>
					<Table.TableHeader>Action</Table.TableHeader>
					<Table.TableHeader>Resource</Table.TableHeader>
					<Table.TableHeader>Unconditional</Table.TableHeader>
				</Table.TableRow>
			</Table.TableHead>
			<Table.TableBody>
				{policies.map((policy) => (
					<CollapsibleRow
						key={policy.id}
						data={
							<>
								<Table.TableCell>
									<Text>{policy.name}</Text>
									<Text description order="xs">
										{policy.id}
									</Text>
								</Table.TableCell>
								<Table.TableCell>{policy.action}</Table.TableCell>
								<Table.TableCell>{policy.resource}</Table.TableCell>
								<Table.TableCell>
									<BooleanText value={policy.conditions.length === 0} />
								</Table.TableCell>
							</>
						}
					>
						<div className="p-2">
							{policy.conditions.length === 0 ? (
								<Text description order="sm">
									This policy is unconditional and will always be applied.
								</Text>
							) : (
								<div>
									<Text order="sm">
										This policy will only be applied if the following conditions are met:
									</Text>
									<List.OrderedList>
										{policy.conditions.map((condition) => (
											<List.ListItem key={condition.id} className="flex flex-row gap-2 list-">
												<Text description order="sm">
													{condition.field}
												</Text>
												<Text description order="sm" className="font-bold">
													{operatorMapping[condition.operator]}
												</Text>
												<Text description order="sm">
													{JSON.stringify(condition.value)}
												</Text>
											</List.ListItem>
										))}
									</List.OrderedList>
								</div>
							)}
						</div>
					</CollapsibleRow>
				))}
			</Table.TableBody>
		</Table.Table>
	);
}
