"use client";

import { useState, createContext, useEffect, useRef } from "react";
import type { AuthContextProps, AuthProviderProps } from "./types";
import type { SafeUser, SignInInput, SignUpInput } from "@shared/common/types";
import { NullSchema, SafeUserSchema } from "@shared/common/schemas";
import { signOut, getUser } from "@lib/actions";
import { query } from "@utils";
import dynamic from "next/dynamic";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	tokenId: null,
	loading: true,
	signOut: async () => 0,
	signIn: async () => 0,
	signUp: async () => 0,
	updateUser: async () => ({ error: null }),
	syncUser: () => {},
});

function _AuthProvider({ children }: AuthProviderProps) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<SafeUser | null>(null);
	const [tokenId, setTokenId] = useState<string | null>(null);

	// AbortController to cancel updateUser requests
	const updateUserAbortController = useRef<AbortController | null>(null);

	function syncUser() {
		setLoading(true);
		getUser().then(({ status, data: reqUser, tokenId }) => {
			if (status === 200) {
				setUser(reqUser);
				setTokenId(tokenId ?? null);
			}
			setLoading(false);
		});
	}

	useEffect(syncUser, []);

	async function updateUser(update: Partial<SafeUser>) {
		if (!user || loading) return { error: "User not loaded" };

		// Cancel previous update request
		if (updateUserAbortController.current) {
			updateUserAbortController.current.abort();
		}
		const abort = new AbortController();
		updateUserAbortController.current = abort;

		try {
			const { status, data, error } = await query({
				path: `/user/${user.id}`,
				init: {
					method: "PATCH",
					body: JSON.stringify(update),
					signal: abort.signal,
				},
				validator: SafeUserSchema,
			});

			if (status === 200) {
				setUser(data);
				return { error: null };
			}

			return { error: error?.cause ?? "Failed to update user" };
		} catch (error) {
			console.error("Failed to update user", error);
			if (error instanceof Error) {
				if (error.name === "AbortError") {
					return { error: null };
				}
				return { error: error.message };
			}
			return { error: "Failed to update user" };
		} finally {
			updateUserAbortController.current = null;
		}
	}

	async function handleSignout(): Promise<number> {
		setLoading(true);
		const { status } = await signOut();

		if (status === 204) {
			setUser(null);
			setTokenId(null);
		}
		setLoading(false);
		return status;
	}

	async function handleSignIn(input: SignInInput): Promise<number> {
		const { status } = await query({
			path: "/auth/signin",
			init: {
				method: "POST",
				body: JSON.stringify(input),
			},
			validator: NullSchema,
		});

		if (status === 201) {
			syncUser();
		}
		return status;
	}

	async function handleSignUp(input: SignUpInput): Promise<number> {
		const { status } = await query({
			path: "/auth/signup",
			init: {
				method: "POST",
				body: JSON.stringify(input),
			},
			validator: NullSchema,
		});
		if (status === 201) {
			syncUser();
		}
		return status;
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				tokenId,
				loading,
				signOut: handleSignout,
				signIn: handleSignIn,
				signUp: handleSignUp,
				updateUser,
				syncUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const AuthProvider = dynamic(() => Promise.resolve(_AuthProvider), { ssr: false });
