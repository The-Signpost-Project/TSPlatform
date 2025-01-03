import type { ReactNode } from "react";
import type { SafeUser, SignInInput, SignUpInput } from "@shared/common/types";

export interface AuthContextProps {
	user: SafeUser | null;
	tokenId: string | null;
	loading: boolean;
	signOut: () => Promise<number>;
	signIn: (data: SignInInput) => Promise<number>;
	signUp: (data: SignUpInput) => Promise<number>;
	updateUser: (user: Partial<SafeUser>) => Promise<{ error: string | null }>;
	syncUser: () => void;
}

export interface AuthProviderProps {
	children: ReactNode;
}
