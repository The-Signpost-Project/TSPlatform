import { HttpException } from "@nestjs/common";

export class AppError extends HttpException {
	public code: number;
	constructor(error: AppErrorType) {
		super(error.name, error.code, { cause: error.cause });
		this.name = error.name;
		this.code = error.code;
	}
}

interface AppErrorType {
	name: string;
	code: number;
	cause: string;
}

export const AppErrorTypes = {
	Panic: (cause: string) => ({
		name: "Panic",
		code: 500,
		cause,
	}),
	FormValidationError: (cause: string) => ({
		name: "FormValidationError",
		code: 400,
		cause,
	}),
	DatabaseError: (name: string, code: number, cause: string) => ({
		name,
		code,
		cause,
	}),
	InvalidCredentials: {
		name: "InvalidCredentials",
		code: 403,
		cause: "Invalid username or password",
	},
	UserNotFound: {
		name: "UserNotFound",
		code: 404,
		cause: "User not found",
	},
	Unauthorized: {
		name: "Unauthorized",
		code: 401,
		cause: "Unauthorized",
	},
	ResouceExists: {
		name: "ResourceExists",
		code: 409,
		cause: "Resource already exists",
	},
	GenericError: (cause: string) => ({
		name: "GenericError",
		code: 500,
		cause,
	}),
	InvalidState: {
		name: "InvalidState",
		code: 400,
		cause: "Invalid state from OAuth provider",
	},
	InvalidProvider: {
		name: "InvalidProvider",
		code: 400,
		cause: "OAuth provider not found",
	},
	InvalidToken: {
		name: "InvalidToken",
		code: 400,
		cause: "Invalid token",
	},
	AlreadyVerified: {
		name: "AlreadyVerified",
		code: 400,
		cause: "Email already verified",
	},
	NoEmail: {
		name: "NoEmail",
		code: 400,
		cause: "No email address set",
	},
	RateLimitExceeded: (limit: number, ttl: number, timetoBlockExpire: number) => ({
		name: "RateLimitExceeded",
		code: 429,
		cause: `Rate limit exceeded. Try again in ${timetoBlockExpire}s. Limit: ${limit} request${limit === 1 ? "" : "s"} per ${ttl}s.`,
	}),
	// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this context
} as const satisfies Record<string, ((...args: any[]) => AppErrorType) | AppErrorType>;
