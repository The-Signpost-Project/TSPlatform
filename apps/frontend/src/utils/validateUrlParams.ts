import type { ZodType } from "zod";

export function validateUrlParams<T>(validate: ZodType<T>, url: URL): T | null {
	const { searchParams } = url;

	const validation = validate.safeParse(Object.fromEntries(searchParams));

	if (!validation.success) return null;

	return validation.data;
}
