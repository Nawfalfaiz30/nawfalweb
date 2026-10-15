import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { applyPageMetadata, escapeHtml } from "./seo-utils.mjs";

const outDir = path.resolve("dist");
const server = await createServer({ configFile: "./vite.config.ts", mode: "production", server: { middlewareMode: true }, appType: "custom" });
try {
  const loaded = await Promise.all([
    server.ssrLoadModule("/src/App.tsx"),
    server.ssrLoadModule("/src/lib/content.ts"),
    server.ssrLoadModule("/src/config/site.ts"),
    server.ssrLoadModule("/src/lib/seo.ts"),
  ]);
  const App = loaded[0].default;
  const content = loaded[1];
  const siteConfig = loaded[2].siteConfig;
  const seo = loaded[3];
  const baseHtml = await readFile(path.join(outDir, "index.html"), "utf8");
  const articlePaths = content.publishedPosts.map((post) => "/blog/" + post.slug);
  const paths = [...seo.staticRoutes, ...articlePaths];
  const articles = new Map(content.publishedPosts.map((post) => ["/blog/" + post.slug, post]));

  async function renderPage(routePath, outputFile) {
    const article = articles.get(routePath);
    const metadata = seo.getPageMetadata(routePath, article);
    const markup = renderToString(React.createElement(App, { initialPath: routePath }));
    const rootMarkup = '<div id="root">' + markup + "</div>";
    let html = baseHtml.replace('<div id="root"></div>', rootMarkup);
    if (!html.includes(rootMarkup)) throw new Error("Root aplikasi tidak ditemukan saat prerender.");
    html = applyPageMetadata(html, metadata, seo.getJsonLd(routePath, metadata, article));
    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, html, "utf8");
  }

  for (const routePath of paths) {
    const output = routePath === "/" ? path.join(outDir, "index.html") : path.join(outDir, routePath.slice(1), "index.html");
    await renderPage(routePath, output);
  }
  await renderPage("/__not-found__", path.join(outDir, "404.html"));

  const sitemapItems = paths.map((routePath) => {
    const article = articles.get(routePath);
    const loc = routePath === "/" ? siteConfig.url + "/" : siteConfig.url + routePath;
    return "  <url><loc>" + escapeHtml(loc) + "</loc>" + (article ? "<lastmod>" + escapeHtml(article.date) + "</lastmod>" : "") + "</url>";
  });
  const sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + sitemapItems.join("\n") + "\n</urlset>\n";
  await writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

  const rssItems = content.publishedPosts.map((post) => {
    const link = siteConfig.url + "/blog/" + post.slug;
    const date = new Date(post.date + "T00:00:00Z").toUTCString();
    return "    <item><title>" + escapeHtml(post.title) + "</title><link>" + escapeHtml(link) + "</link><guid isPermaLink=\"true\">" + escapeHtml(link) + "</guid><pubDate>" + date + "</pubDate><description>" + escapeHtml(post.description) + "</description></item>";
  });
  const rss = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\"><channel><title>" + escapeHtml(siteConfig.name) + " — Blog</title><link>" + escapeHtml(siteConfig.url) + "/blog</link><description>Tulisan dan catatan Nawfal Ulinnuha Faiz.</description><language>id-ID</language><lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>\n" + rssItems.join("\n") + "\n</channel></rss>\n";
  await writeFile(path.join(outDir, "rss.xml"), rss, "utf8");
  console.log("Prerender berhasil: " + paths.length + " rute, 404.html, sitemap.xml, rss.xml");
} finally {
  await server.close();
}
