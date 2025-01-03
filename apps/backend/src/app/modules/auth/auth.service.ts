import { Injectable } from "@nestjs/common";
import { password as bunPassword } from "bun";
import type {
	SignInInput,
	TokenCookie,
	SignUpInput,
	ForgotPasswordReset,
	ChangePasswordInput,
} from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}

	private hashPassword(password: string): Promise<string> {
		return bunPassword.hash(password, {
			algorithm: "argon2id",
			memoryCost: 2 ** 12,
			timeCost: 2,
		});
	}

	async signUp(data: SignUpInput): Promise<TokenCookie> {
		const passwordHash = await this.hashPassword(data.password);
		try {
			const user = await this.prisma.user.create({
				data: {
					id: this.lucia.generateUserId(),
					username: data.username,
					email: data.email,
					passwordHash,
				},
			});

			const token = this.lucia.generateSessionToken();
			const session = await this.lucia.createSession(token, user.id);

			return {
				value: token,
				expiresAt: session.expiresAt,
			};
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}

	async signIn(data: SignInInput): Promise<TokenCookie> {
		const user = await this.prisma.user.findFirst({
			where: {
				email: data.email,
			},
		});

		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// no password -- used oauth
		if (user.passwordHash === null) {
			throw new AppError(AppErrorTypes.InvalidCredentials);
		}

		const isValidPassword = await bunPassword.verify(data.password, user.passwordHash);

		if (!isValidPassword) {
			throw new AppError(AppErrorTypes.InvalidCredentials);
		}

		const token = this.lucia.generateSessionToken();
		const session = await this.lucia.createSession(token, user.id);

		return {
			value: token,
			expiresAt: session.expiresAt,
		};
	}

	async signOut(tokenId: string): Promise<void> {
		const { session } = await this.lucia.validateSessionToken(tokenId);
		if (!session) throw new AppError(AppErrorTypes.InvalidToken);

		await this.lucia.invalidateSession(session.id);
	}

	async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
		const { oldPassword, newPassword, repeatPassword } = data;
		if (newPassword !== repeatPassword) {
			throw new AppError(
				AppErrorTypes.FormValidationError("New password and repeat password do not match"),
			);
		}
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				passwordHash: true,
			},
		});

		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// if user has no password, check it
		if (!user.passwordHash && oldPassword) {
			throw new AppError(AppErrorTypes.InvalidCredentials);
		}

		// if user has password, verify it
		if (user.passwordHash && oldPassword) {
			const isValidPassword = await bunPassword.verify(oldPassword, user.passwordHash);
			if (!isValidPassword) {
				throw new AppError(AppErrorTypes.InvalidCredentials);
			}
		}

		// hash the new password
		const passwordHash = await this.hashPassword(newPassword);

		await this.prisma.user.update({
			where: { id: userId },
			data: { passwordHash },
		});
	}

	async resetPassword(data: ForgotPasswordReset): Promise<void> {
		// find reset password token if it exists
		const token = await this.prisma.passwordResetToken.findFirst({
			where: {
				token: data.token,
				expiresAt: {
					gte: new Date(),
				},
			},
			select: {
				userId: true,
			},
		});

		if (!token) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		const passwordHash = await this.hashPassword(data.newPassword);

		await this.prisma.user.update({
			where: {
				id: token.userId,
			},
			data: {
				passwordHash,
			},
		});

		// delete the token
		await this.prisma.passwordResetToken.delete({
			where: {
				token: data.token,
			},
		});
	}

	async verifyEmail(token: string): Promise<void> {
		const emailVerificationToken = await this.prisma.verificationToken.findFirst({
			where: {
				token,
				expiresAt: {
					gte: new Date(),
				},
			},
			select: {
				userId: true,
			},
		});

		if (!emailVerificationToken) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		await this.prisma.user.update({
			where: {
				id: emailVerificationToken.userId,
			},
			data: {
				verified: true,
			},
		});

		await this.prisma.verificationToken.delete({
			where: {
				token,
			},
		});
	}
}
