import { z } from "zod";
import type {
	CreatePolicyInput,
	CreateRoleInput,
	UpdatePolicyInput,
	UpdateRoleInput,
	StrictCondition,
	StrictPolicy,
	StrictRole,
} from "@shared/common/types";

const resourceSchema = z.enum([
	"peddler",
	"disability",
	"role",
	"policy",
	"case",
	"peddlerMergeRequest",
	"region",
	"team",
	"allUsers",
]);

const operatorSchema = z.enum([
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
]);

export const CreatePolicyInputSchema = z.object({
	name: z.string().min(1),
	action: z.enum(["read", "readWrite"]),
	resource: resourceSchema,
	conditions: z.array(
		z.object({
			field: z.string().min(1),
			operator: operatorSchema,
			value: z.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.array(z.string()),
				z.array(z.number()),
			]),
		}),
	),
}) satisfies z.ZodType<CreatePolicyInput>;

export const UpdatePolicyInputSchema =
	CreatePolicyInputSchema.partial() satisfies z.ZodType<UpdatePolicyInput>;

export const CreateRoleInputSchema = z.object({
	name: z.string(),
	policies: z.array(z.object({ id: z.string() })),
}) satisfies z.ZodType<CreateRoleInput>;

export const UpdateRoleInputSchema =
	CreateRoleInputSchema.partial() satisfies z.ZodType<UpdateRoleInput>;

export const GetPolicyInputSchema = z.string();

export const GetRoleInputSchema = z.string();

export const StrictConditionSchema = z.object({
	id: z.string(),
	field: z.string(),
	operator: operatorSchema,
	value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.array(z.number())]),
	policyId: z.string(),
}) satisfies z.ZodType<StrictCondition>;

export const StrictPolicySchema = z.object({
	id: z.string(),
	name: z.string(),
	action: z.enum(["read", "readWrite"]),
	resource: resourceSchema,
	conditions: z.array(StrictConditionSchema),
}) satisfies z.ZodType<StrictPolicy>;

export const StrictRoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	policies: z.array(StrictPolicySchema),
}) satisfies z.ZodType<StrictRole>;
