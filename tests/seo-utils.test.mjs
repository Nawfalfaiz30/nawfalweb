import test from "node:test";
import assert from "node:assert/strict";
import { applyPageMetadata, replaceTitle, setMetaTag, setCanonicalLink, replaceJsonLd } from "../scripts/seo-utils.mjs";
test("setMetaTag replaces duplicate descriptions", () => {
  const html = '<head><meta name="description" content="a"><meta name="description" content="b"></head>';
  const result = setMetaTag(html, "name", "description", "A & safe");
  assert.equal((result.match(/name="description"/g) || []).length, 2);
  assert.equal((result.match(/content="A &amp; safe"/g) || []).length, 2);
});
test("title and canonical values are escaped", () => {
  assert.match(replaceTitle("<head><title>Old</title></head>", "A < B"), /<title>A &lt; B<\/title>/);
  assert.match(setCanonicalLink("<head></head>", "https://example.test/blog"), /rel="canonical" href="https:\/\/example\.test\/blog"/);
});
test("JSON-LD escapes angle brackets", () => {
  const out = replaceJsonLd("<head></head>", { name: "</script><script>alert(1)</script>" });
  assert.match(out, /\\u003c\/script\\u003e/);
});
test("page metadata includes OG, Twitter and robots", () => {
  const out = applyPageMetadata("<head><title>Old</title></head>", {
    title: "Article", description: "Description", canonical: "https://example.test/a",
    image: "https://example.test/og.png", ogType: "article", robots: "index, follow",
  }, { "@type": "BlogPosting" });
  assert.match(out, /property="og:title" content="Article"/);
  assert.match(out, /name="twitter:card" content="summary_large_image"/);
  assert.match(out, /name="robots" content="index, follow"/);
});
