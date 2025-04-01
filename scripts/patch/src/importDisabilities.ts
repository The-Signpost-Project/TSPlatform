import { randomUUIDv7 } from "bun";
import { promises as fs } from "node:fs";
import * as path from "node:path";

const csvPath = path.join(__dirname, "..", "disability.csv");
const csvData = await fs.readFile(csvPath, "utf8");
const lines = csvData.split("\n").map(line => line.trim()).filter(line => line.length > 0);
const [_header, ...rows] = lines;

const sqlStatements: string[] = [];
for (const row of rows) {
  const name = row; // each row is the disability name
  if (!name) continue;
  const id = randomUUIDv7();
  sqlStatements.push(
    `INSERT INTO Disability (id, name) VALUES ('${id}', '${name.replace(/'/g, "''")}');`
  );
}

const dumpPath = path.join(__dirname, "..", "disabilities_dump.sql");
await fs.writeFile(dumpPath, sqlStatements.join("\n"), "utf8");
console.info(`Dump written to ${dumpPath}`);
