"use client";
import { List, Table, Text, Code } from "@lib/components";
import type { PolicyTableProps } from "./types";
import { CollapsibleRow } from "./CollapsibleRow";
import { BooleanText } from "../../../components/BooleanText";
import { DeletePolicy } from "../DeletePolicy";
import { operatorMapping } from "@shared/common/constants";
import { EditPolicy } from "../EditPolicy";


export function PolicyTable({ policies }: PolicyTableProps) {
	return (
		<Table.Table>
			<Table.TableHead>
				<Table.TableRow>
					<Table.TableHeader>Name</Table.TableHeader>
					<Table.TableHeader>Action</Table.TableHeader>
					<Table.TableHeader>Resource</Table.TableHeader>
					<Table.TableHeader>Unconditional</Table.TableHeader>
					<Table.TableHeader>Actions</Table.TableHeader>
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
								<Table.TableCell>
									<div className="flex gap-2">
										<EditPolicy {...policy} />
										<DeletePolicy id={policy.id} name={policy.name} />
									</div>
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
											<List.ListItem key={condition.id} className="flex flex-row gap-2">
												<Text description order="sm">
													{condition.field}
												</Text>
												<Text description order="sm">
													{operatorMapping[condition.operator]}
												</Text>
												<Code className="text-sm">{JSON.stringify(condition.value)}</Code>
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
