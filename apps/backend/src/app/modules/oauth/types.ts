export interface InitOAuthData {
	state: string;
	url: string;
	codeVerifier?: string;
}

export type GoogleUser = {
	sub: string;
	email: string | null;
	name: string;
};

export type OAuthUser = {
	id: string;
	email: string | null;
	username: string;
};
