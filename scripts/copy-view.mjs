import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcHtml = join(root, "src", "view", "index.html");
const destDir = join(root, "dist", "view");
const destHtml = join(destDir, "index.html");

await mkdir(destDir, { recursive: true });
await copyFile(srcHtml, destHtml);
console.log("Copied view/index.html -> dist/view/index.html");
