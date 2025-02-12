import { faker } from "@faker-js/faker";

export function getTestFile() {
	return {
		originalname: faker.system.fileName(),
		mimetype: faker.system.mimeType(),
		path: faker.system.filePath(),
		buffer: Buffer.from(faker.animal.cow()),
	} as Express.Multer.File;
}
