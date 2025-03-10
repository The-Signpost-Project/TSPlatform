import { S3Client, randomUUIDv7 } from "bun";
import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "node:path";
import { AppError, AppErrorTypes } from "@utils/appErrors";

interface UploadOptions {
	dir?: string;
	contentType?: string;
}

@Injectable()
export class S3Service extends S3Client implements OnModuleInit {
	constructor(configService: ConfigService) {
		const accessKey = configService.get<string>("S3_ACCESS_KEY");
		const secretKey = configService.get<string>("S3_SECRET_KEY");
		const bucket = configService.get<string>("S3_BUCKET");
		const endpoint = configService.get<string>("S3_ENDPOINT");

		super({
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
			bucket,
			endpoint,
		});
	}

	async onModuleInit() {
		// ping the S3 service to check if the credentials are correct
		try {
			await this.write("ping.txt", Buffer.from("ping"));
		} catch (error) {
			// @ts-ignore
			console.error("Could not connect to the S3 server:", error, error.code);
		}
	}

	async upload(file: Express.Multer.File, options: UploadOptions = {}) {
		const fileName = randomUUIDv7();
		const path = options.dir ? join(options.dir, fileName) : fileName;
		try {
			await this.file(path).write(Buffer.from(file.buffer), { type: options.contentType });
			return path;
		} catch (error) {
			// @ts-ignore
			console.error(error, error.code);
			throw new AppError(AppErrorTypes.Panic(`Failed to upload file: ${path}`));
		}
	}

	async remove(path: string) {
		try {
			await this.file(path).delete();
		} catch (error) {
			// @ts-ignore
			console.error(error, error.code);
			throw new AppError(AppErrorTypes.Panic(`Failed to remove file: ${path}`));
		}
	}

	private presignValidityDuration = 60 * 60 * 24 * 7; // 7 days
	async getUrl(path: string) {
		return this.file(path).presign({
			expiresIn: this.presignValidityDuration,
		});
	}
}
