import type { ReactNode } from "react";
import type { Action, Resource, SafeUser, SignInInput, SignUpInput } from "@shared/common/types";

export interface AuthContextProps {
	user: SafeUser | null;
	tokenId: string | null;
	loading: boolean;
	userHasPermission: (
		resource: Resource,
		action: Action,
		// biome-ignore lint/suspicious/noExplicitAny: any is required here
		resourceObj?: Record<string, any>,
	) => boolean;
	signOut: () => Promise<number>;
	signIn: (data: SignInInput) => Promise<number>;
	signUp: (data: SignUpInput) => Promise<number>;
	updateUser: (user: Partial<SafeUser>) => Promise<{ error: string | null }>;
	syncUser: () => void;
}

export interface AuthProviderProps {
	children: ReactNode;
}
