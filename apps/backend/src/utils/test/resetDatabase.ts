import { $ } from "bun";

export async function resetDatabase() {
	if (process.env.NODE_ENV !== "test") {
		throw new Error("resetDatabase should only be used in test environment");
	}
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}
	await $`bun run prisma:resetDb > /dev/null`;
}
