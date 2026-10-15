export function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export function replaceTitle(html, title) {
  const safe = escapeHtml(title);
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + safe + "</title>");
  return html.replace("</head>", "<title>" + safe + "</title>\n</head>");
}
export function setMetaTag(html, attribute, key, content) {
  const pattern = new RegExp("<meta\\b(?=[^>]*\\b" + attribute + "\\s*=\\s*[\\\"']" + key + "[\\\"'])[^>]*>", "gi");
  const tag = "<meta " + attribute + "=\"" + escapeHtml(key) + "\" content=\"" + escapeHtml(content) + "\" />";
  let found = false;
  const output = html.replace(pattern, () => { found = true; return tag; });
  return found ? output : output.replace("</head>", "  " + tag + "\n</head>");
}
export function setCanonicalLink(html, href) {
  const pattern = /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi;
  const tag = "<link rel=\"canonical\" href=\"" + escapeHtml(href) + "\" />";
  let found = false;
  const output = html.replace(pattern, () => { found = true; return tag; });
  return found ? output : output.replace("</head>", "  " + tag + "\n</head>");
}
export function replaceJsonLd(html, data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const tag = "<script type=\"application/ld+json\">" + json + "</script>";
  const pattern = /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", "  " + tag + "\n</head>");
}
export function applyPageMetadata(html, metadata, jsonLd) {
  let output = replaceTitle(html, metadata.title);
  const tags = [
    ["name", "description", metadata.description],
    ["property", "og:type", metadata.ogType],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:url", metadata.canonical],
    ["property", "og:image", metadata.image],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    ["name", "twitter:image", metadata.image],
    ["name", "robots", metadata.robots],
  ];
  for (const entry of tags) output = setMetaTag(output, entry[0], entry[1], entry[2]);
  return replaceJsonLd(setCanonicalLink(output, metadata.canonical), jsonLd);
}
