import { S3Client } from "bun";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Service extends S3Client {
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
}
