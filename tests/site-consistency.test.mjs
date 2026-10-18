import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function getSiteUrl() {
  const source = read("src/config/site.ts");
  const match = source.match(/\burl:\s*"([^"]+)"/);
  assert.ok(match, "siteConfig.url harus ditemukan di src/config/site.ts");
  return match[1];
}

test("siteConfig.url memakai host www", () => {
  const siteUrl = getSiteUrl();
  assert.ok(siteUrl.startsWith("https://www.nawfalulinnuhafaiz.my.id"), "siteConfig.url harus diawali https://www.nawfalulinnuhafaiz.my.id");
  assert.equal(siteUrl, "https://www.nawfalulinnuhafaiz.my.id");
});

test("public/sitemap.xml memakai host yang sama dengan siteConfig.url", () => {
  const siteHost = new URL(getSiteUrl()).host;
  const sitemap = read("public/sitemap.xml");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locs.length > 0, "sitemap.xml harus memuat setidaknya satu <loc>");
  for (const loc of locs) assert.equal(new URL(loc).host, siteHost, "loc memakai host berbeda: " + loc);
});

test("public/robots.txt memakai host yang sama dengan siteConfig.url", () => {
  const siteHost = new URL(getSiteUrl()).host;
  const robots = read("public/robots.txt");
  const match = robots.match(/^Sitemap:\s*(\S+)\s*$/m);
  assert.ok(match, "robots.txt harus memuat baris Sitemap");
  assert.equal(new URL(match[1]).host, siteHost);
  assert.match(new URL(match[1]).pathname, /^\/sitemap\.xml$/);
});

test("index.html tidak memuat canonical non-www", () => {
  const siteHost = new URL(getSiteUrl()).host;
  const html = read("index.html");
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]*>/i);
  assert.ok(canonical, "index.html harus memuat rel=canonical");
  const href = canonical[0].match(/href="([^"]+)"/)?.[1];
  assert.ok(href, "rel=canonical harus memiliki href");
  assert.equal(new URL(href).host, siteHost);
  assert.doesNotMatch(html, /https:\/\/nawfalulinnuhafaiz\.my\.id/);

  for (const key of ["og:url", "og:image", "twitter:image"]) {
    const tag = html.match(new RegExp("<meta\\b[^>]*" + key + "[^>]*>", "i"));
    assert.ok(tag, "index.html harus memuat meta " + key);
    const content = tag[0].match(/content="([^"]+)"/)?.[1];
    assert.ok(content, "meta " + key + " harus memiliki content");
    assert.equal(new URL(content).host, siteHost, "meta " + key + " memakai host berbeda");
  }

  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLd, "index.html harus memuat JSON-LD");
  const person = JSON.parse(jsonLd[1]);
  assert.equal(new URL(person.url).host, siteHost);
});

test("public/.well-known/security.txt memuat policy www dan format RFC 9116", () => {
  const siteHost = new URL(getSiteUrl()).host;
  const sec = read("public/.well-known/security.txt");
  assert.match(sec, /^Contact:\s*mailto:/m);
  assert.match(sec, /^Expires:\s*\d{4}-\d{2}-\d{2}T/m);
  const policyMatch = sec.match(/^Policy:\s*(\S+)\s*$/m);
  assert.ok(policyMatch, "security.txt harus memuat Policy");
  assert.equal(new URL(policyMatch[1]).host, siteHost);
});
