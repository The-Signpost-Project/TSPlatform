import { randomUUIDv7 } from "bun";
import { promises as fs } from "node:fs";
import * as path from "node:path";

// Helper: generate INSERT SQL statement.
const generateInsertSQL = (table: string, data: any) => {
	const keys = Object.keys(data);
	const values = keys.map(key => {
		const v = data[key];
		return typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v;
	});
	return `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")});`;
};

// Helper: parse a date string in "dd/MM/yyyy [HH:mm:ss]" format.
const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");
  const time = timePart || "00:00:00";
  const d = new Date(`${year}-${month}-${day}T${time}`);
  return isNaN(d.getTime()) ? new Date() : d;
};

const DEFAULT_CREATED_BY_ID = "system";
const DEFAULT_REGION_ID = "0195d272-591b-7781-b02b-831bc865fad1";

// Build mapping from new_peddlers.csv: codename -> id
const newPeddlersPath = path.join(__dirname, "..", "new_peddlers.csv");
const newPeddlersData = await fs.readFile(newPeddlersPath, "utf8");
const npLines = newPeddlersData.split("\n").map(line => line.trim()).filter(line => line.length > 0);
// Assume first line is header; subsequent rows: id,codename,...
const [_npHeader, ...npRows] = npLines;
const peddlerMapping = new Map();
for (const row of npRows) {
  const cols = row.split(",").map(col => col.trim());
  let [pid, codename] = cols;
  if(pid) peddlerMapping.set(codename, pid);
}

// Process case.csv to generate dump SQL for Case table.
const casesPath = path.join(__dirname, "..", "case.csv");
const casesData = await fs.readFile(casesPath, "utf8");
const caseLines = casesData.split("\n").map(line => line.trim()).filter(line => line.length > 0);
const [caseHeader, ...caseRows] = caseLines;
// Expected header: id,createdAt,updatedAt,interactionDate,location,notes,importance,firstInteraction,USER EMAIL,PEDDLER CODENAME
const sqlStatements = [];
for (const row of caseRows) {
  const cols = row.split(",").map(col => col.trim());
  let [
    id,
    createdAt,
    updatedAt,
    interactionDate,
    location,
    notes,
    importance,
    firstInteractionStr,
    // userEmail (ignored),
    peddlerCodename
  ] = cols;
  if (!id) id = randomUUIDv7();
  // Use createdAt for updatedAt if missing.
  if (!updatedAt) updatedAt = createdAt;
  const createdISO = parseDate(createdAt).toISOString();
  const updatedISO = parseDate(updatedAt).toISOString();
  const interactionISO = parseDate(interactionDate).toISOString();
  // Convert firstInteraction to Boolean ("yes" -> true).
  const firstInteraction = firstInteractionStr?.toLowerCase() === "yes";
  // Lookup foreign key id from new_peddlers mapping.
  const peddlerId = peddlerMapping.get(peddlerCodename) || "";
  console.log(importance)
  
  sqlStatements.push(
    generateInsertSQL("Case", {
      id,
      createdAt: createdISO,
      updatedAt: updatedISO,
      interactionDate: interactionISO,
      location,
      notes,
      importance: Number(importance),
      firstInteraction,
      peddlerId,
      createdById: DEFAULT_CREATED_BY_ID,
      regionId: DEFAULT_REGION_ID
    })
  );
}

const dumpPath = path.join(__dirname, "..", "cases_dump.sql");
await fs.writeFile(dumpPath, sqlStatements.join("\n"), "utf8");
console.info(`Dump written to ${dumpPath}`);
