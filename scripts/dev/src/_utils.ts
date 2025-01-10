import * as path from "node:path";
import { findUp } from "find-up";

export async function getMonorepoRoot(): Promise<string | undefined> {
	const packageJsonPath = await findUp("turbo.json");
	return packageJsonPath ? path.dirname(packageJsonPath) : undefined;
}
