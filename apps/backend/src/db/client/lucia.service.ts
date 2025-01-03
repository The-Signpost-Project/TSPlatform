import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";
import { Session, User } from "@prisma/client";
import { randomBytes, createHash } from "node:crypto";
import { handleDatabaseError } from "@utils/prismaErrors";
import type { Response } from "express";
import { TokenCookie } from "@shared/common/types";

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

@Injectable()
export class LuciaService {
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {}

	private sessionDuration = 1000 * 60 * 60 * 24 * 30; // 30 days

	generateUserId(): string {
		return randomBytes(16).toString("hex");
	}

	generateSessionToken(): string {
		const bytes = randomBytes(32);
		return bytes.toString("hex");
	}

	async createSession(token: string, userId: string): Promise<Session> {
		const sessionId = createHash("sha256").update(token).digest("hex");
		const session = {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + this.sessionDuration),
		};
		try {
			await this.prismaService.session.create({ data: session });
		} catch (error) {
			handleDatabaseError(error);
		}
		return session;
	}

	async validateSessionToken(token: string): Promise<SessionValidationResult> {
		const sessionId = createHash("sha256").update(token).digest("hex");
		const result = await this.prismaService.session.findUnique({
			where: { id: sessionId },
			include: { user: true },
		});
		if (result === null) {
			return { session: null, user: null };
		}
		const { user, ...session } = result;

		// delete session if expired
		if (session.expiresAt.getTime() < Date.now()) {
			try {
				await this.prismaService.session.delete({ where: { id: sessionId } });
			} catch (error) {
				handleDatabaseError(error);
			}
			return { session: null, user: null };
		}

		// refresh if under half the duration left
		if (session.expiresAt.getTime() - Date.now() < this.sessionDuration / 2) {
			try {
				await this.prismaService.session.update({
					where: { id: sessionId },
					data: { expiresAt: new Date(Date.now() + this.sessionDuration) },
				});
			} catch (error) {
				handleDatabaseError(error);
			}
		}

		return { session, user };
	}

	async invalidateSession(sessionId: string): Promise<void> {
		try {
			await this.prismaService.session.delete({ where: { id: sessionId } });
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	setSessionCookie(res: Response, cookieName: string, token: TokenCookie): void {
		res.cookie(cookieName, token.value, {
			expires: token.expiresAt,
			httpOnly: true,
			secure: this.configService.get<string>("NODE_ENV") === "production",
			sameSite: "lax",
		});
	}
}
