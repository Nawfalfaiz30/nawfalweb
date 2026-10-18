export const siteConfig = {
  name: "Nawfal Ulinnuha Faiz",
  domain: "nawfalulinnuhafaiz.my.id",
  url: "https://www.nawfalulinnuhafaiz.my.id",
  email: "nawfalulinnuhafaiz82@gmail.com",
  githubUsername: "NawfalFaiz30",
  featuredRepositoryNames: ["licia", "nawfalweb"],
  whatsappNumber: "6281227504772",
};

export const socialLinks = [
  { name: "WhatsApp", icon: "whatsapp", description: "Hubungi saya untuk percakapan langsung.", href: `https://wa.me/${siteConfig.whatsappNumber}`, kind: "contact" },
  { name: "Instagram", icon: "instagram", description: "Ikuti pembaruan dan catatan visual.", href: "https://instagram.com/nawfalulinnuhafaiz", kind: "profile" },
  { name: "GitHub", icon: "github", description: "Lihat repositori dan eksplorasi teknis.", href: `https://github.com/${siteConfig.githubUsername}`, kind: "profile" },
  { name: "LinkedIn", icon: "linkedin", description: "Terhubung dalam jejaring profesional.", href: "https://www.linkedin.com/in/nawfal-ulinnuha-faiz-7423a5292", kind: "profile" },
  { name: "Email", icon: "mail", description: "Kirim pesan melalui email.", href: `mailto:${siteConfig.email}`, kind: "email" },
] as const;

export const liciaProject = {
  slug: "licia-personal-life-os",
  title: "Licia — Personal Life OS",
  summary: "Licia 2.0 adalah Personal Life OS yang menghubungkan AI, produktivitas, pengetahuan, kebiasaan, kesehatan, keuangan, dan refleksi dalam satu sistem pribadi dengan dukungan PWA, offline recovery, serta sinkronisasi multi-perangkat.",
  href: "https://github.com/Nawfalfaiz30/licia",
  demo: "https://www.licia.site",
  tags: ["Next.js 16", "React 19", "TypeScript", "Supabase", "AI · Offline-first"],
};

export const featuredProject = {
  slug: "tabulasi-suara-kertas-plano",
  number: "02",
  title: "Tabulasi Suara Kertas Plano Pemilu",
  summary: "Sistem tabulasi berbasis image processing pada ESP32 untuk menghitung pemilih dan GPT-4o Vision API untuk mengekstrak data dari Kertas C Plano, dilengkapi validasi otomatis berbasis perbandingan data.",
  tags: ["ESP32", "Image Processing", "GPT-4o Vision API"],
};
