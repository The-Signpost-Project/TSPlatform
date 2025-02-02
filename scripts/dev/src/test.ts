import { writeFileSync } from "fs";
import { Buffer } from "buffer";

const res = await fetch("http://localhost:8080/report/019487c3-dec9-7da2-a4b2-3b23dab10c37");

const file = await res.blob();
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
writeFileSync("a.docx", buffer);
