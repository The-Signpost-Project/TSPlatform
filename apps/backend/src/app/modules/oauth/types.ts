export interface InitOAuthData {
	state: string;
	url: string;
	codeVerifier?: string;
}

export type DiscordUser = OAuthUser;

export type GoogleUser = {
	sub: string;
	email: string | null;
	name: string;
};

export type GitHubUser = {
	id: number;
	email: string | null;
	login: string;
};

export type OAuthProvider = "discord" | "google" | "github";

export type OAuthUser = {
	id: string;
	email: string | null;
	username: string;
};
