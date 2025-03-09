import * as path from "node:path";
import { findUp } from "find-up";
import { existsSync, readFileSync } from "node:fs";

export async function getMonorepoRoot(): Promise<string | undefined> {
	const packageJsonPath = await findUp("turbo.json");
	return packageJsonPath ? path.dirname(packageJsonPath) : undefined;
}

export function getPatchFileContent(name: string): string | undefined {
	const patchPath = path.join("./patches", name);
	if (existsSync(patchPath)) {
		return readFileSync(patchPath, { encoding: "utf-8", flag: "r" });
	}
	throw new Error(`Patch file ${patchPath} not found`);
}

export function generateInsertSQL(table: string, data: Record<string, unknown>): string {
	const keys = Object.keys(data);
	const values = Object.values(data).map((v) => {
		if (typeof v === "string") {
			return `'${v}'`;
		}
		return v;
	});

	return `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")});`;
}
