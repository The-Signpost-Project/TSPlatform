import { $ } from "bun";
import { getMonorepoRoot } from "./_utils";
import * as path from "node:path";
import { mkdir } from "node:fs";
import { Client } from "minio";

const ROOT_USER = "admin";
const ROOT_PASSWORD = "admin123";
const BUCKET_NAME = "tsplatform-bucket";

// check if docker daemon is running
try {
	await $`docker info > /dev/null`;
} catch (_e) {
	throw new Error("Docker daemon is not running");
}

// pull minio image
await $`docker pull minio/minio:latest`;

// create minio data directory
const root = await getMonorepoRoot();
if (root === undefined) {
	throw new Error("Could not find monorepo root");
}

const minioDataPath = path.join(root, ".minio-data");
mkdir(minioDataPath, { recursive: true }, (err) => {
	if (err) {
		throw err;
	}
});

// run minio container
await $`docker run -d -p 9000:9000 -p 9001:9001 --name minio -v ${minioDataPath}:/data -e "MINIO_ROOT_USER=${ROOT_USER}" -e "MINIO_ROOT_PASSWORD=${ROOT_PASSWORD}" minio/minio server /data --console-address ":9001"`;

// check if minio container is running
// use exponential backoff to wait for minio to start
let retries = 0;
const maxRetries = 4;
while (retries < maxRetries) {
	try {
		await fetch("http://localhost:9001");
		break;
	} catch (_e) {
		await new Promise((resolve) => setTimeout(resolve, 2 ** retries * 1000));
		retries++;
	}
}

if (retries === maxRetries) {
	throw new Error("Minio container did not start");
}

// create minio client
const minioClient = new Client({
	endPoint: "localhost",
	port: 9000,
	useSSL: false,
	accessKey: ROOT_USER,
	secretKey: ROOT_PASSWORD,
});

const exists = await minioClient.bucketExists(BUCKET_NAME);
if (!exists) {
	const policy = JSON.stringify({
		Version: "2012-10-17",
		Statement: [
			{
				Action: ["s3:GetObject"],
				Effect: "Allow",
				Principal: {
					AWS: ["*"],
				},
				Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
				Sid: "",
			},
		],
	});
	await minioClient.makeBucket(BUCKET_NAME, "ap-southeast-1");
	await minioClient.setBucketPolicy(BUCKET_NAME, policy);
}

console.info(
	"Minio setup complete. Access key:",
	ROOT_USER,
	"Secret key:",
	ROOT_PASSWORD,
	"Bucket name:",
	BUCKET_NAME,
);
