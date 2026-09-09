/** רושם את ה-resolve hook. נטען דרך --import לפני שהבדיקות עולות. */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
register("./loader.mjs", pathToFileURL(`${here}${path.sep}`));
