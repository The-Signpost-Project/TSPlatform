export type OAuthProvider = "discord" | "google" | "github";
export type SignUpInput = {
	username: string;
	email: string;
	password: string;
	repeatPassword: string;
};

export type SignInInput = {
	email: string;
	password: string;
};

export type TokenCookie = {
	value: string;
	expiresAt: Date;
};

export type ForgotPasswordEmail = {
	email: string;
};

export type ForgotPasswordReset = {
	token: string;
	newPassword: string;
};

export type VerifyEmail = {
	id: string;
};

export type ChangePasswordInput = {
	oldPassword?: string;
	newPassword: string;
	repeatPassword: string;
};
