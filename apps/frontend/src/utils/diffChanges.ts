"use server";
import { deepStrictEqual } from "node:assert";

/**
 * Compare two objects and return the changes.
 * This method expects the objects to have the same keys.
 * @param oldObj The old object.
 * @param newObj The new object.
 * @returns The changes.
 */
// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this context
export async function diffChanges(oldObj: Record<string, any>, newObj: Record<string, any>) {
	// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this context
	const changes: Record<string, any> = {};
	for (const key in oldObj) {
		try {
			deepStrictEqual(oldObj[key], newObj[key]);
		} catch {
			changes[key] = newObj[key];
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this context
	return changes as Record<keyof typeof newObj, any>;
}
