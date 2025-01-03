import type { OAuthProvider } from "@shared/common/types";

export const sessionCookieName = "tokenId" as const;

export const oAuthCookieNames = {
	discord: {
		state: "discordOauthState",
	},
	google: {
		state: "googleOauthState",
		codeVerifier: "googleOauthCodeVerifier",
	},
	github: {
		state: "githubOauthState",
	},
} as const satisfies {
	[key in OAuthProvider]: {
		state: string;
		codeVerifier?: string;
	};
};
