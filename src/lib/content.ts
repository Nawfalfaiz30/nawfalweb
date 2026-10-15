type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  cover?: string;
  body: string;
};

const files = import.meta.glob("../content/blog/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

function parsePost(raw: string, path: string): BlogPost | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter artikel tidak valid: ${path}`);
  const frontmatter = Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const item = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    return item ? [[item[1], item[2].trim()]] : [];
  }));
  const title = frontmatter.title?.replace(/^['"]|['"]$/g, "");
  const description = frontmatter.description?.replace(/^['"]|['"]$/g, "");
  const date = frontmatter.date?.replace(/^['"]|['"]$/g, "");
  const slug = frontmatter.slug?.replace(/^['"]|['"]$/g, "") || path.split("/").pop()?.replace(/\.md$/, "");
  const tags = (frontmatter.tags || "").replace(/^\[|\]$/g, "").split(",").map((tag) => tag.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  const draft = frontmatter.draft === "true";
  const cover = frontmatter.cover?.replace(/^['"]|['"]$/g, "");
  if (!title || !description || !date || !slug) throw new Error(`Metadata title, description, date, dan slug wajib: ${path}`);
  return { slug, title, description, date, tags, draft, cover, body: match[2].trim() };
}

const allPosts = Object.entries(files).map(([path, raw]) => parsePost(raw, path)).filter((post): post is BlogPost => post !== null);
const slugs = allPosts.map((post) => post.slug);
if (new Set(slugs).size !== slugs.length) throw new Error("Slug artikel harus unik.");

export const publishedPosts = allPosts.filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date));
export function getPost(slug: string) { return publishedPosts.find((post) => post.slug === slug); }

export function renderMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: Array<{ type: string; text: string }> = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCode = false;
  const flushParagraph = () => { if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") }); paragraph = []; };
  const flushList = () => { if (list.length) blocks.push({ type: "ul", text: list.join("\n") }); list = []; };
  for (const line of lines) {
    if (line.startsWith("```")) { flushParagraph(); flushList(); if (inCode) blocks.push({ type: "pre", text: code.join("\n") }); code = []; inCode = !inCode; continue; }
    if (inCode) { code.push(line); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); blocks.push({ type: `h${heading[1].length}`, text: heading[2] }); continue; }
    if (/^[-*]\s+/.test(line)) { flushParagraph(); list.push(line.replace(/^[-*]\s+/, "")); continue; }
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    paragraph.push(line.trim());
  }
  flushParagraph(); flushList();
  if (inCode && code.length) blocks.push({ type: "pre", text: code.join("\n") });
  return blocks;
}
