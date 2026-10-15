import { featuredProject, liciaProject, siteConfig } from "../config/site";

export type ArticleMetadata = { slug: string; title: string; description: string; date: string; tags?: string[] };

export const staticRoutes = [
  "/", "/tentang", "/proyek", "/proyek/licia-personal-life-os",
  "/proyek/tabulasi-suara-kertas-plano", "/blog", "/novel", "/cv",
  "/kontak", "/sosial", "/privasi",
] as const;

const pages: Record<string, { title: string; description: string }> = {
  "/": { title: "Nawfal Ulinnuha Faiz — Elektronika, Embedded & Software", description: "Profil, proyek, CV, tulisan, dan kanal komunikasi Nawfal Ulinnuha Faiz." },
  "/tentang": { title: "Tentang Saya", description: "Profil dan perjalanan Nawfal Ulinnuha Faiz, lulusan D3 Teknik Elektronika PENS." },
  "/proyek": { title: "Proyek", description: "Licia Personal Life OS, proyek akhir Teknik Elektronika, dan repositori GitHub Nawfal Ulinnuha Faiz." },
  "/proyek/licia-personal-life-os": { title: liciaProject.title, description: liciaProject.summary },
  "/proyek/tabulasi-suara-kertas-plano": { title: featuredProject.title, description: featuredProject.summary },
  "/blog": { title: "Blog", description: "Tulisan dan catatan Nawfal Ulinnuha Faiz tentang teknologi, belajar, dan penulisan." },
  "/novel": { title: "Hujan dan Payung Biru", description: "Informasi novel Hujan dan Payung Biru karya Nawfal Ulinnuha Faiz." },
  "/cv": { title: "Curriculum Vitae", description: "Curriculum Vitae Nawfal Ulinnuha Faiz, lulusan D3 Teknik Elektronika dengan minat pada software dan embedded." },
  "/kontak": { title: "Kontak", description: "Hubungi Nawfal Ulinnuha Faiz melalui email, WhatsApp, atau formulir kontak." },
  "/sosial": { title: "Social Hub", description: "Kanal komunikasi resmi Nawfal Ulinnuha Faiz." },
  "/privasi": { title: "Kebijakan Privasi", description: "Kebijakan privasi situs Nawfal Ulinnuha Faiz." },
};

export function normalizePath(path: string): string {
  const value = path.split("?")[0].split("#")[0] || "/";
  return value === "/" ? "/" : value.replace(/\/+$/, "") || "/";
}

export function getPageMetadata(path: string, article?: ArticleMetadata) {
  const normalized = normalizePath(path);
  const isArticle = normalized.startsWith("/blog/") && Boolean(article);
  const page = pages[normalized];
  const known = Boolean(page) || isArticle;
  const title = isArticle && article ? article.title : page?.title ?? "Halaman tidak ditemukan";
  const description = isArticle && article ? article.description : page?.description ?? "Halaman yang Anda cari tidak tersedia.";
  const canonical = normalized === "/" ? siteConfig.url + "/" : siteConfig.url + normalized;
  return {
    title: title === "Nawfal Ulinnuha Faiz — Elektronika, Embedded & Software" ? title : title + " — " + siteConfig.name,
    description,
    canonical,
    image: siteConfig.url + "/images/portfolio-workspace.jpg",
    ogType: isArticle ? "article" : "website",
    robots: known ? "index, follow" : "noindex, nofollow",
  };
}

export function getJsonLd(path: string, metadata: ReturnType<typeof getPageMetadata>, article?: ArticleMetadata) {
  const normalized = normalizePath(path);
  const person = {
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    address: { "@type": "PostalAddress", addressLocality: "Gunung Putri", addressRegion: "Bogor", addressCountry: "ID" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Politeknik Elektronika Negeri Surabaya" },
    sameAs: [
      "https://instagram.com/nawfalulinnuhafaiz",
      "https://github.com/" + siteConfig.githubUsername,
      "https://www.linkedin.com/in/nawfal-ulinnuha-faiz-7423a5292",
    ],
  };
  if (normalized.startsWith("/blog/") && article) {
    return {
      "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title,
      description: article.description, datePublished: article.date, author: person,
      mainEntityOfPage: { "@type": "WebPage", "@id": metadata.canonical },
      url: metadata.canonical, image: metadata.image,
    };
  }
  if (normalized === "/novel") {
    return {
      "@context": "https://schema.org", "@type": "Book", name: "Hujan dan Payung Biru",
      author: person, datePublished: "2025", isbn: "978-623-5453-49-1", url: metadata.canonical,
    };
  }
  return { "@context": "https://schema.org", ...person, mainEntityOfPage: metadata.canonical };
}
