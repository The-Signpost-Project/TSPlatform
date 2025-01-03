import type { OAuthProvider } from "@shared/common/types";

export const sessionCookieName = "tokenId" as const;

export const oAuthCookieNames = {
	google: {
		state: "googleOauthState",
		codeVerifier: "googleOauthCodeVerifier",
	},
} as const satisfies {
	[key in OAuthProvider]: {
		state: string;
		codeVerifier?: string;
	};
};
