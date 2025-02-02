import { join } from "node:path";

export abstract class Templater {
	protected publicDir = join(process.cwd(), "src", "public");
}
