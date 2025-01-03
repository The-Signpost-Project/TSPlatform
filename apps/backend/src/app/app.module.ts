import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule, OpenAuthModule, UserModule, EmailModule } from "./modules";
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
	DATABASE_URL: z.string(),
	DATABASE_TOKEN: z.string().optional(),
	DISCORD_OAUTH_CLIENT_ID: z.string(),
	DISCORD_OAUTH_CLIENT_SECRET: z.string(),
	DISCORD_OAUTH_REDIRECT_URI: z.string(),
	GOOGLE_OAUTH_CLIENT_ID: z.string(),
	GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
	GOOGLE_OAUTH_REDIRECT_URI: z.string(),
	GITHUB_OAUTH_CLIENT_ID: z.string(),
	GITHUB_OAUTH_CLIENT_SECRET: z.string(),
	GITHUB_OAUTH_REDIRECT_URI: z.string(),
	EMAIL_HOST: z.string(),
	EMAIL_PORT: z.string().transform((val) => Number.parseInt(val, 10)),
	EMAIL_SECURE: z.string().transform((val) => val.toLowerCase() === "true"),
	EMAIL_USER: z.string(),
	EMAIL_PASSWORD: z.string(),
});

@Module({
	imports: [
		AuthModule,
		OpenAuthModule,
		UserModule,
		EmailModule,
		ConfigModule.forRoot({
			envFilePath: [envFilePath, ".env.local"],
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
