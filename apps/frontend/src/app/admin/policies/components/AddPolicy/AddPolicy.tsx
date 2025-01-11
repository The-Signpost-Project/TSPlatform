"use client";
import {
	Modal,
	TextInput,
	Autocomplete,
	Title,
	ModalCloseButton,
	Text,
	Button,
	Toggle,
	AddButton,
} from "@lib/components";
import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { CreatePolicyInputSchema } from "@shared/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreatePolicyInput, Resource, StrictCondition } from "@shared/common/types";
import { createPolicy } from "./actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function AddPolicy() {
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, formState, setValue, watch, control, reset } =
		useForm<CreatePolicyInput>({
			resolver: zodResolver(CreatePolicyInputSchema),
			defaultValues: {
				action: "read",
			},
		});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "conditions",
	});
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	async function onSubmit(data: CreatePolicyInput) {
		const { status, error, data: response } = await createPolicy(data);
		if (status === 201) {
			toast.success(`Policy ${response?.name} created.`);
			setModalOpen(false);
			router.refresh();
			reset();
			return;
		}

		toast.error(error?.cause);
	}

	return (
		<>
			<AddButton onClick={() => setModalOpen(true)} subject="Policy" />
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				className="min-w-72 sm:min-w-96"
			>
				<div className="flex justify-between">
					<Title order={5}>Add a policy</Title>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				</div>
				<Text order="sm" description>
					Policies control access to your resources. They are attached to roles which can then be
					assigned to users.
				</Text>
				<form
					onSubmit={handleSubmit((args) => startTransition(() => onSubmit(args)))}
					className="flex flex-col justify-center gap-4 mt-4"
				>
					<TextInput
						label="Name"
						placeholder="Enter a descriptive name (eg. 'writeAllUsers')"
						disabled={isPending}
						{...register("name")}
						variant={formState.errors.name ? "error" : undefined}
						helperText={formState.errors.name?.message as string}
					/>
					<div className="flex justify-between items-center">
						<Text order="sm" description>
							Allow write?
						</Text>
						<div className="flex gap-2 items-center">
							<Text order="sm" description>
								{watch("action") === "read" ? "Read only" : "Read + Write"}
							</Text>
							<Toggle
								onChange={(e) => setValue("action", e.target.checked ? "readWrite" : "read")}
								disabled={isPending}
								className={formState.errors.action ? "ring-red-500" : ""}
							/>
						</div>
					</div>

					<Autocomplete
						items={
							[
								"peddler",
								"disability",
								"role",
								"policy",
								"case",
								"peddlerMergeRequest",
								"region",
								"team",
								"allUsers",
							] as const satisfies Resource[]
						}
						label="Resource"
						handleChange={(val) => setValue("resource", val as Resource)}
						placeholder="Select a resource"
						disabled={isPending}
						variant={formState.errors.resource ? "error" : undefined}
						helperText={formState.errors.resource?.message as string}
					/>

					<div className="flex sm:gap-4 gap-2 items-center">
						<div className="flex-grow">
							<Text order="sm" description>
								Conditions (advanced)
							</Text>
							<Text order="xs" description>
								Use conditions to further restrict access to a policy. Conditions have to define a
								key (field) of the resource, a comparator, and a value.
							</Text>

							<Text order="xs" description>
								Not all resources support conditions. If you are unsure, leave this blank to allow
								all.
							</Text>
						</div>

						<Button
							onClick={(e) => {
								e.preventDefault();
								append({ field: "", operator: "eq", value: "" });
							}}
							className="h-1/4 sm:text-nowrap"
						>
							Add Condition
						</Button>
					</div>
					{fields.length === 0 ? (
						<Text order="sm" description>
							This policy is <span className="font-bold">unconditional</span>.
						</Text>
					) : (
						<>
							<Text order="sm" description>
								This policy is <span className="font-bold">conditional</span>.
							</Text>
							<div className="flex flex-col gap-1">
								<Text order="xs" description>
									A field is a specific attribute of the resource that you want to apply the
									condition to. For example, if the resource is "user", a field could be "name" or
									"id".
								</Text>
								<Text order="xs" description>
									An operator is a comparison function that is used to compare the field value with
									the specified value. For example, "eq" means "equals", "ne" means "not equals",
									"lt" means "less than", and so on.
								</Text>
								<Text order="xs" description>
									A value is the specific data that you want to compare the field against using the
									operator. For example, if the field is "name" and the operator is "eq", the value
									could be "John" to specify that the condition should match users with the name
									"John". Supported datatypes are: string, number, boolean, string[], number[]. The
									data will be serialised to JSON format.
								</Text>
							</div>
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-end">
									<TextInput
										label="Field"
										{...register(`conditions.${index}.field` as const)}
										disabled={isPending}
										variant={formState.errors.conditions?.[index]?.field ? "error" : undefined}
										helperText={formState.errors.conditions?.[index]?.field?.message as string}
									/>
									<Autocomplete
										items={
											[
												"eq",
												"ne",
												"lt",
												"lte",
												"gt",
												"gte",
												"in",
												"nin",
												"contains",
												"startsWith",
												"endsWith",
											] as const satisfies StrictCondition["operator"][]
										}
										value="eq"
										label="Operator"
										handleChange={(val) =>
											setValue(`conditions.${index}.operator`, val as StrictCondition["operator"])
										}
										placeholder=""
										disabled={isPending}
										variant={formState.errors.conditions?.[index]?.operator ? "error" : undefined}
										helperText={formState.errors.conditions?.[index]?.operator?.message as string}
									/>
									<TextInput
										label="Value"
										placeholder=""
										{...register(`conditions.${index}.value` as const)}
										disabled={isPending}
										variant={formState.errors.conditions?.[index]?.value ? "error" : undefined}
										helperText={formState.errors.conditions?.[index]?.value?.message as string}
									/>
									<Button
										onClick={(e) => {
											e.preventDefault();
											remove(index);
										}}
										color="danger"
									>
										Remove
									</Button>
								</div>
							))}
						</>
					)}

					<Button type="submit" color="success" disabled={isPending}>
						Create Policy
					</Button>
				</form>
			</Modal>
		</>
	);
}
