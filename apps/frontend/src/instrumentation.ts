import type { Instrumentation } from "next";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("dotenv").then((mod) => mod.config());
		await import("zod")
			.then((mod) => mod.z)
			.then((z) => {
				const envSchema = z.object({
					NODE_ENV: z.string().default("development"),
					NEXT_PUBLIC_API_URL_SERVER: z.string().url(),
					NEXT_PUBLIC_API_URL_CLIENT: z.string().url(),
				});
				const { success, error } = envSchema.safeParse(process.env);
				if (!success) {
					throw new Error(JSON.stringify(error));
				}
			});
	}
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
	if (process.env.NODE_ENV === "production" && process.env.NEXT_RUNTIME !== "edge") {
		await import("@shared/logger")
			.then((mod) => mod.default)
			.then((logger) => {
				logger.error({
					error,
					request,
					context,
				});
				console.error(error);
			});
	}
};
