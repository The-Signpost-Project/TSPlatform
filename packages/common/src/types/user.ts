import type { Prettify } from "./utils";
import type { OAuthProvider } from "./auth";

export type SafeUser = {
	id: string;
	username: string;
	email: string | null;
	createdAt: Date;
	verified: boolean;
	oAuthProviders: OAuthProvider[];
	hasPassword: boolean;

	// User preferences
	allowMarketing: boolean;
	timezone: string;
};

export type GetUserInput = string;
export type UpdateUserInput = Prettify<Partial<Omit<SafeUser, "id">>>;
export type DeleteUserInput = {
	username: string;
};
