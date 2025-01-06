import type { Prettify } from "./utils";
import type { OAuthProvider } from "./auth";
import type { StrictRole } from "./role";

export type SafeUser = {
	id: string;
	username: string;
	email: string | null;
	createdAt: Date;
	verified: boolean;
	oAuthProviders: OAuthProvider[];
	hasPassword: boolean;

	// User preferences
	allowEmailNotifications: boolean;

	// Roles
	roles: StrictRole[];
};

export type GetUserInput = string;
export type UpdateUserInput = Prettify<
	Partial<
		Omit<SafeUser, "id" | "createdAt" | "oAuthProviders" | "hasPassword" | "roles"> & {
			roles: {
				roleId: string;
			}[];
		}
	>
>;
export type DeleteUserInput = {
	username: string;
};
