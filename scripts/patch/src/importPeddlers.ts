import { randomUUIDv7 } from "bun";
import { promises as fs } from "node:fs";
import * as path from "node:path";

// Helper to generate INSERT SQL statement
const generateInsertSQL = (table: string, data: Record<string, any>) => {
	const keys = Object.keys(data);
	const values = keys.map((key) => {
		const v = data[key];
		return typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v;
	});
	return `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")});`;
};

// Top-level await used instead of an async IIFE
const csvPath = path.join(__dirname, "..", "peddlers.csv");
const csvData = await fs.readFile(csvPath, "utf8");
const lines = csvData
	.split("\n")
	.map((line) => line.trim())
	.filter((line) => line.length > 0);
const [_header, ...rows] = lines;
const DEFAULT_REGION_ID = "0195d272-591b-7781-b02b-831bc865fad1";

const sqlStatements: string[] = [];
for (const row of rows) {
	const cols = row.split(",").map((col) => col.trim());
	let [id, codename, firstName, lastName, race, sex, birthYear, remarks, createdAt] = cols;
	if (!id) id = randomUUIDv7(); // generate id if missing
	firstName = firstName || "";
	remarks = remarks || "";
	// Validate and fallback for createdAt date
	const parsedDate = new Date(createdAt);
	const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
	sqlStatements.push(
		generateInsertSQL("Peddler", {
			id,
			codename,
			mainRegionId: DEFAULT_REGION_ID,
			firstName,
			lastName,
			race,
			sex,
			birthYear,
			remarks,
			createdAt: validDate.toISOString(),
		}),
	);
}

const dumpPath = path.join(__dirname, "..", "peddlers_dump.sql");
await fs.writeFile(dumpPath, sqlStatements.join("\n"), "utf8");
console.info(`Dump written to ${dumpPath}`);
