import fs from "fs";
import path from "path";
import { randomUUIDv7 } from "bun";

const csvFilePath = path.join(__dirname, "..", "peddlerDisability.csv");
const dumpFilePath = path.join(__dirname, "peddlerDisabilities_dump.sql");
const csvContent = fs.readFileSync(csvFilePath, "utf8");

const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
const header = lines[0].split(",").map((col) => col.trim());
const queries: string[] = [];

for (let i = 1; i < lines.length; i++) {
	// Basic splitting; assumes no commas in fields
	const fields = lines[i].split(",").map((f) => f.trim());
	if (fields.length < header.length) continue; // Skip incomplete rows
	const row: { [key: string]: string } = {};
	header.forEach((col, idx) => (row[col] = fields[idx]));

	const peddlerId = row["Peddler ID"].replace(/'/g, "''");
	const disabilityId = row["Disability ID"].replace(/'/g, "''");
	const sql = `INSERT INTO "PeddlerDisability" (id, peddlerId, disabilityId) VALUES ('${randomUUIDv7()}', '${peddlerId}', '${disabilityId}');`;
	queries.push(sql);
}

fs.writeFileSync(dumpFilePath, queries.join("\n"));
console.log(`SQL dump created at ${dumpFilePath}`);
