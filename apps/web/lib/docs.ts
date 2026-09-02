import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";

const candidates = [
  path.join(process.cwd(), "docs"),
  path.join(process.cwd(), "..", "..", "docs"),
  path.join(process.cwd(), "..", "docs"),
];

async function docsRoot() {
  for (const dir of candidates) {
    try {
      await access(dir);
      return dir;
    } catch {
      // try next
    }
  }
  return candidates[1];
}

export async function listDocs() {
  const files = await readdir(await docsRoot());
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function readDoc(slug: string) {
  const safe = slug.replace(/[^a-z0-9-]/g, "") || "index";
  const pages = await listDocs();
  if (!pages.includes(safe)) {
    throw new Error("DOC_NOT_FOUND");
  }
  return readFile(path.join(await docsRoot(), `${safe}.md`), "utf8");
}
