import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import {
	AuthModule,
	OpenAuthModule,
	UserModule,
	EmailModule,
	PeddlerModule,
	RoleModule,
  CaseModule
} from "./modules";
import { RateLimitGuard } from "@guards";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";

let envFilePath: string;
switch (process.env.NODE_ENV) {
	case "production":
		envFilePath = ".env.production";
		break;
	case "test":
		envFilePath = ".env.test";
		break;
	// biome-ignore lint/complexity/noUselessSwitchCase: better to be explicit
	case "development":
	default:
		envFilePath = ".env.development";
}

const envSchema = z.object({
	NODE_ENV: z.string().default("development"),
	FRONTEND_URL: z.string().url(),
	BACKEND_INTERNAL_URL: z.string().url(),
	BACKEND_PUBLIC_URL: z.string().url(),
	COOKIE_DOMAIN: z.string().optional(),

	DATABASE_URL: z.string(),
	DATABASE_TOKEN: z.string().optional(),

	GOOGLE_OAUTH_CLIENT_ID: z.string(),
	GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
	GOOGLE_OAUTH_REDIRECT_URI: z.string(),

	GOOGLE_OAUTH_EMAIL_REDIRECT_URI: z.string(),
	GOOGLE_OAUTH_EMAIL_REFRESH_TOKEN: z.string(),
	GOOGLE_OAUTH_EMAIL_USER: z.string(),

	S3_ACCESS_KEY: z.string(),
	S3_SECRET_KEY: z.string(),
	S3_BUCKET: z.string(),
	S3_ENDPOINT: z.string().url(),
});

@Module({
	imports: [
		AuthModule,
		OpenAuthModule,
		UserModule,
		EmailModule,
		PeddlerModule,
		RoleModule,
    CaseModule,
		ConfigModule.forRoot({
			envFilePath: [envFilePath],
			isGlobal: true,
			validate: (config) => {
				const parsedConfig = envSchema.parse(config);
				return parsedConfig;
			},
		}),
		// temporary until we have more established endpoints and separate throttling for them
		ThrottlerModule.forRoot([
			{
				ttl: 1000, // 1 second
				limit: 20, // 20 requests
			},
		]),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RateLimitGuard,
		},
	],
})
export class AppModule {}
