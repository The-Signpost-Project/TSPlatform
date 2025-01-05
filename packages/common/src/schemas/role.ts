import { z } from "zod";
import type {
  CreatePolicyInput,
  CreateRoleInput,
  UpdatePolicyInput,
  UpdateRoleInput,
} from "@shared/common/types";

export const CreatePolicyInputSchema = z.object({
  name: z.string(),
  action: z.enum(["read", "write"]),
  resource: z.enum([
    "peddler",
    "disability",
    "role",
    "policy",
    "case",
    "peddlerMergeRequest",
    "user",
    "region",
    "team",
  ]),
  conditions: z.array(
    z.object({
      field: z.string(),
      operator: z.enum([
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
      ]),
      value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.array(z.number())]),
      policyId: z.string(),
    })
  ),
}) satisfies z.ZodType<CreatePolicyInput>;


export const UpdatePolicyInputSchema = CreatePolicyInputSchema.partial() satisfies z.ZodType<UpdatePolicyInput>;

export const CreateRoleInputSchema = z.object({
  name: z.string(),
  policies: z.array(z.object({ id: z.string() })),
}) satisfies z.ZodType<CreateRoleInput>;

export const UpdateRoleInputSchema = CreateRoleInputSchema.partial() satisfies z.ZodType<UpdateRoleInput>;

export const GetPolicyInputSchema = z.string();

export const GetRoleInputSchema = z.string(); 

