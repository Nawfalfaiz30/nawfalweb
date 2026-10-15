export const siteConfig = {
  name: "Nawfal Ulinnuha Faiz",
  domain: "nawfalulinnuhafaiz.my.id",
  url: "https://nawfalulinnuhafaiz.my.id",
  email: "nawfalulinnuhafaiz82@gmail.com",
  githubUsername: "NawfalFaiz30",
  whatsappNumber: "6281227504772",
};

export const socialLinks = [
  { name: "WhatsApp", icon: "whatsapp", description: "Hubungi saya untuk percakapan langsung.", href: `https://wa.me/${siteConfig.whatsappNumber}`, kind: "contact" },
  { name: "Instagram", icon: "instagram", description: "Ikuti pembaruan dan catatan visual.", href: "https://instagram.com/nawfalulinnuhafaiz", kind: "profile" },
  { name: "GitHub", icon: "github", description: "Lihat repositori dan eksplorasi teknis.", href: `https://github.com/${siteConfig.githubUsername}`, kind: "profile" },
  { name: "LinkedIn", icon: "linkedin", description: "Terhubung dalam jejaring profesional.", href: "https://www.linkedin.com/in/nawfal-ulinnuha-faiz-7423a5292", kind: "profile" },
  { name: "Email", icon: "mail", description: "Kirim pesan melalui email.", href: `mailto:${siteConfig.email}`, kind: "email" },
] as const;

export const featuredProject = {
  slug: "tabulasi-suara-kertas-plano",
  title: "Tabulasi Suara Kertas Plano Pemilu",
  summary: "Sistem tabulasi berbasis image processing pada ESP32 untuk menghitung pemilih dan GPT-4o Vision API untuk mengekstrak data dari Kertas C Plano, dilengkapi validasi otomatis berbasis perbandingan data.",
  tags: ["ESP32", "Image Processing", "GPT-4o Vision API"],
};
