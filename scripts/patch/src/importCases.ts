import fs from "fs";
import path from "path";
import { randomUUIDv7 } from "bun";

function parseDate(dateStr: string): string {
	// Assumes format "dd/mm/yyyy HH:mm:ss" or "dd/mm/yyyy"
	const parts = dateStr.split(" ");
	const [d, m, y] = parts[0].split("/");
	const timeParts = parts[1] ? parts[1].split(":").map(Number) : [0, 0, 0];
	const iso = new Date(+y, +m - 1, +d, ...timeParts);
	return iso.toISOString();
}

const csvFilePath = path.join(__dirname, "..", "case.csv");
const dumpFilePath = path.join(__dirname, "cases_dump.sql");
const csvContent = fs.readFileSync(csvFilePath, "utf8");

// Split by line and extract header
const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
const header = lines[0].split(",");
const queries: string[] = [];

for (let i = 1; i < lines.length; i++) {
	// Basic splitting; assumes no commas in fields
	const fields = lines[i].split(",");
	if (fields.length < header.length) continue; // Skip incomplete rows
	const row: { [key: string]: string } = {};
	header.forEach((col, idx) => (row[col.trim()] = fields[idx].trim()));

	const createdAt = parseDate(row.createdAt);
	const updatedAt = parseDate(row.updatedAt);
	const interactionDate = parseDate(row.interactionDate);
	const createdById = row.createdById;
	const regionId = row.regionId;
	const location = row.location.replace(/'/g, "''");
	const notes = row.notes.replace(/'/g, "''");
	const importance = Number.parseInt(row.importance, 10);
	console.log("importance", row.importance);
	const firstInteraction = row.firstInteraction.toLowerCase() === "true";
	const peddlerId = row.peddlerId;
	// Generate SQL INSERT statement for the Case table.
	const sql = `INSERT INTO "Case" (id, createdAt, updatedAt, createdById, interactionDate, regionId, location, notes, importance, firstInteraction, peddlerId) VALUES ('${randomUUIDv7()}', '${createdAt}', '${updatedAt}', '${createdById}', '${interactionDate}', '${regionId}', '${location}', '${notes}', ${importance}, ${firstInteraction}, '${peddlerId}');`;
	queries.push(sql);
}

fs.writeFileSync(dumpFilePath, queries.join("\n"));
console.log(`SQL dump created at ${dumpFilePath}`);
