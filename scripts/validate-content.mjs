import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const directory = path.resolve("src/content/blog");
const files = (await readdir(directory)).filter((name) => name.endsWith(".md"));
const slugs = new Map();
for (const file of files) {
  const raw = await readFile(path.join(directory, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(file + ": frontmatter pembuka/penutup tidak ditemukan");
  const fields = Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const item = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    return item ? [[item[1], item[2].trim().replace(/^["']|["']$/g, "")]] : [];
  }));
  for (const required of ["title", "description", "date", "slug", "draft"]) if (!fields[required]) throw new Error(file + ": field " + required + " wajib diisi");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date) || Number.isNaN(Date.parse(fields.date + "T00:00:00Z"))) throw new Error(file + ": date harus YYYY-MM-DD");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug)) throw new Error(file + ": slug tidak valid");
  if (slugs.has(fields.slug)) throw new Error(file + ": slug duplikat " + fields.slug);
  slugs.set(fields.slug, file);
  if (fields.draft !== "true" && fields.draft !== "false") throw new Error(file + ": draft harus true atau false");
}
console.log("Konten valid: " + files.length + " file Markdown");
