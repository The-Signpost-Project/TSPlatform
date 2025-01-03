import pino from "pino";
import { createStream } from "rotating-file-stream";
import { existsSync, mkdirSync } from "node:fs";

const logDirectory = `${process.cwd()}/logs`;

if (!existsSync(logDirectory)) {
	mkdirSync(logDirectory);
}

function getFileName(time: Date | number | null): string {
	if (typeof time === "number" || time === null) {
		return `${logDirectory}/access.log`;
	}
	return `${logDirectory}/${time.toISOString().split("T")[0]}.log`;
}

const stream = createStream(getFileName, {
	interval: "1d",
	maxFiles: 30,
});

const logger = pino(stream);

export default logger;
