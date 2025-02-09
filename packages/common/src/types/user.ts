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

export type RawUser = {
	id: string;
	username: string;
	email: string | null;
	passwordHash: string | null;
	createdAt: string;
	verified: boolean;
	allowEmailNotifications: boolean;
};

export type UpdateUserInput = Prettify<
	Partial<Pick<SafeUser, "username" | "email" | "verified" | "allowEmailNotifications">>
>;
export type UpdateUserRolesInput = {
	roles?: { roleId: string }[];
};
export type DeleteUserInput = {
	username: string;
};

export type Team = {
	id: string;
	name: string;
	photoPath: string | null;
	members: Omit<SafeUser, "roles">[];
};

export type CreateTeamInput = {
	name: string;
	photo: Express.Multer.File | null;
};

export type UpdateTeamInput = Partial<CreateTeamInput>;

export type UserTeamInput = {
	userId: string;
	teamId: string;
};
