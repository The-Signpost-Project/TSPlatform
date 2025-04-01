import { promises as fs } from "node:fs";
import * as path from "node:path";

// Helper to generate UPSERT SQL statement for SQLite.
// It builds INSERT INTO ... VALUES ... ON CONFLICT(id) DO UPDATE SET ... .
const generateUpsertSQL = (table: string, data: Record<string, any>) => {
	const keys = Object.keys(data);
	const columns = keys.join(", ");
	const values = keys
		.map((key) => {
			const v = data[key];
			return typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v;
		})
		.join(", ");
	const updateAssignments = keys
		.filter((key) => key !== "id")
		.map((key) => `${key} = excluded.${key}`)
		.join(", ");
	return `INSERT INTO ${table} (${columns}) VALUES (${values}) ON CONFLICT(id) DO UPDATE SET ${updateAssignments};`;
};

// Read CSV file "upsert.csv"
const csvPath = path.join(__dirname, "..", "upsert.csv");
const csvData = await fs.readFile(csvPath, "utf8");
const lines = csvData
	.split("\n")
	.map((line) => line.trim())
	.filter((line) => line.length > 0);
// Extract header and rows
const [header, ...rows] = lines;
const headers = header.split(",").map((h) => h.trim());

const sqlStatements: string[] = [];
for (const row of rows) {
	const cols = row.split(",").map((col) => col.trim());
	const data: Record<string, string> = {};
	headers.forEach((colName, idx) => {
		if (colName === "mainRegion") {
			// omitted field mainRegion
			return;
		}
		data[colName] = cols[idx] || "";
	});
	// Validate createdAt date if present
	if (data.createdAt) {
		const parsedDate = new Date(data.createdAt);
		data.createdAt = isNaN(parsedDate.getTime())
			? new Date().toISOString()
			: parsedDate.toISOString();
	}
	sqlStatements.push(generateUpsertSQL("Peddler", data));
}

// Write the upsert dump to a file
const dumpPath = path.join(__dirname, "..", "upsert_dump.sql");
await fs.writeFile(dumpPath, sqlStatements.join("\n"), "utf8");
console.info(`Upsert dump written to ${dumpPath}`);
