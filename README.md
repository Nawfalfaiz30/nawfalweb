# nawfalweb

Website pribadi dan Social Hub Nawfal Ulinnuha Faiz. Aplikasi portofolio menggunakan React, TypeScript, dan Vite. Konten disimpan di repository; tidak ada database aplikasi untuk situs portofolio ini. Licia adalah produk terpisah.

## Proyek unggulan

### Licia — Personal Life OS

Licia 2.0 adalah produk web untuk menghubungkan AI, produktivitas, catatan, kalender, fokus, kebiasaan, kesehatan, keuangan, dan refleksi dalam satu sistem pribadi.

- Situs produk: https://www.licia.site
- Repository: https://github.com/Nawfalfaiz30/licia
- Studi kasus di situs portofolio: /proyek/licia-personal-life-os

Proyek akhir D3 berupa sistem tabulasi suara Kertas C Plano tetap ditampilkan sebagai proyek akademik unggulan.

## Menjalankan lokal

Gunakan Node.js 22 dan pnpm 10.

    pnpm install --frozen-lockfile
    pnpm dev

Untuk menguji endpoint serverless secara lokal, jalankan Vercel CLI dengan perintah vercel dev. Vite saja tidak melayani endpoint /api/*.

## Perintah kualitas

- pnpm typecheck — pemeriksaan TypeScript.
- pnpm validate:content — validasi frontmatter dan slug artikel.
- pnpm test — pengujian unit helper SEO menggunakan Node.js test runner.
- pnpm build — build Vite, prerender HTML per rute, serta pembuatan sitemap dan RSS.
- pnpm audit:routes — pemeriksaan metadata, HTML prerender, RSS, dan halaman 404 setelah build.

GitHub Actions menjalankan gerbang tersebut saat push ke main atau pull request menuju main. Deploy statis tidak membutuhkan database.

## Konten

- Informasi sosial dan produk: src/config/site.ts.
- Metadata halaman: src/lib/seo.ts.
- Artikel blog: tambahkan Markdown ke src/content/blog/.

Frontmatter wajib berisi title, description, date (YYYY-MM-DD), slug, tags, dan draft. Slug harus unik; draft: true tidak diterbitkan. HTML halaman artikel dirender saat build, sehingga crawler menerima isi artikel dan metadata tanpa menunggu JavaScript.

Build menghasilkan dist/sitemap.xml, dist/rss.xml, dan dist/404.html. Sitemap output dibuat ulang dari rute dan artikel yang diterbitkan.

## Deploy produksi

Vercel adalah satu-satunya jalur deployment produksi:
1. Hubungkan repository ke proyek Vercel dengan root direktori repository.
2. Build command: pnpm run build; output directory: dist.
3. Uji preview deployment dan formulir kontak sebelum mengalihkan domain produksi.

Tidak ada rewrite global ke /. Berkas statis per rute dan dist/404.html menangani navigasi langsung dan halaman tidak ditemukan. Verifikasi domain dan sertifikat TLS di dashboard sebelum mempromosikan rilis.

## Keamanan, aksesibilitas, dan privasi

Situs mempertahankan pendekatan tanpa database dan tanpa cookie pelacakan. Header keamanan ditetapkan di vercel.json; bila menambahkan sumber script, font, gambar, atau API eksternal, perbarui CSP secara terukur dan uji seluruh rute. Perbarui Kebijakan Privasi sebelum menambah layanan yang memproses data baru.

CV web memiliki stylesheet cetak. Berkas PDF di public/cv/ merupakan aset terpisah dan harus diganti dengan PDF terbaru ketika isi CV resmi diperbarui; perubahan halaman web saja tidak memperbarui berkas PDF biner.
