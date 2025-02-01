import { Injectable, type OnModuleInit, type OnModuleDestroy } from "@nestjs/common";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { handleDatabaseError } from "@utils/prismaErrors";

class ExtendedPrismaClient extends PrismaClient {
	constructor(...args: ConstructorParameters<typeof PrismaClient>) {
		super(...args);
		Object.assign(
			this,
			this.$extends({
				query: {
					$allOperations({ args, query }) {
						return query(args).catch((error) => {
							handleDatabaseError(error); // Will throw an error, propagating it to NestJS
						});
					},
				},
			}),
		);
	}
}

@Injectable()
export class PrismaService extends ExtendedPrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor(configService: ConfigService) {
		const isProduction = configService.get<string>("NODE_ENV") === "production";
		if (!isProduction) {
			super();
			return;
		}
		const dbUrl = configService.get<string>("DATABASE_URL");
		const dbToken = configService.get<string>("DATABASE_TOKEN");

		if (!dbUrl) {
			throw new AppError(AppErrorTypes.Panic("DATABASE_URL is not set"));
		}
		if (!dbToken) {
			throw new AppError(AppErrorTypes.Panic("DATABASE_TOKEN is not set"));
		}

		const client = createClient({ url: dbUrl, authToken: dbToken });

		super({
			adapter: new PrismaLibSQL(client),
		});
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
