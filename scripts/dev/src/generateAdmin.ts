import { password as bunPassword, randomUUIDv7 } from "bun";
import { Database } from "bun:sqlite";
import type { StrictPolicy, StrictRole, RawUser } from "@shared/common/types";
import { getMonorepoRoot } from "./_utils";
import * as path from "node:path";

// WARNING: DO NOT USE THIS IN PRODUCTION

const root = await getMonorepoRoot();
if (root === undefined) {
	throw new Error("Could not find monorepo root");
}

const devDbPath = path.join(root, "apps", "backend", "src", "db", "dev.db");

console.info(`Using dev db path: ${devDbPath}`);
const db = new Database(devDbPath);

async function hashPassword(password: string): Promise<string> {
	return bunPassword.hash(password, {
		algorithm: "argon2id",
		memoryCost: 2 ** 12,
		timeCost: 2,
	});
}

function generateInsertSQL(table: string, data: Record<string, unknown>): string {
	const keys = Object.keys(data);
	const values = Object.values(data).map((v) => {
		if (typeof v === "string") {
			return `'${v}'`;
		}
		return v;
	});

	return `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")});`;
}

const adminUser = {
	id: randomUUIDv7(),
	username: "admin",
	email: "admin@example.com",
	passwordHash: await hashPassword("admin"),
	verified: true,
	allowEmailNotifications: true,
} as const satisfies Omit<RawUser, "createdAt">;

const adminPolicies = [
	{
		id: randomUUIDv7(),
		name: "writeAllUsers",
		action: "readWrite",
		resource: "allUsers",
	},
	{
		id: randomUUIDv7(),
		name: "writeRoles",
		action: "readWrite",
		resource: "role",
	},
	{
		id: randomUUIDv7(),
		name: "writePolicies",
		action: "readWrite",
		resource: "policy",
	},
] as const satisfies Omit<StrictPolicy, "conditions">[];

const adminRole = {
	id: randomUUIDv7(),
	name: "admin",
} as const satisfies Omit<StrictRole, "policies">;

const policyRoles = adminPolicies.map((policy) => ({
	id: randomUUIDv7(),
	policyId: policy.id,
	roleId: adminRole.id,
}));

const adminUserRole = {
	id: randomUUIDv7(),
	userId: adminUser.id,
	roleId: adminRole.id,
};

const toExec = [
	generateInsertSQL("User", adminUser),
	...adminPolicies.map((policy) => generateInsertSQL("Policy", policy)),
	generateInsertSQL("Role", adminRole),
	...policyRoles.map((policyRole) => generateInsertSQL("PolicyRole", policyRole)),
	generateInsertSQL("UserRole", adminUserRole),
];

console.info("Executing:\n", toExec.join("\n"));

for (const sql of toExec) {
	db.exec(sql);
}

console.info("Done. Login with email: admin@example.com, password: admin");
