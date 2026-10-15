# nawfalweb

Website pribadi dan Social Hub Nawfal Ulinnuha Faiz. Aplikasi menggunakan React, TypeScript, dan Vite sesuai scaffold desain; konten awal disimpan di repository. Tidak ada database atau Supabase karena MVP tidak perlu menyimpan konten maupun pesan.

## Menjalankan lokal

1. Gunakan Node.js 20.19+ atau 22.12+.
2. Jalankan `pnpm install`.
3. Jalankan `pnpm dev` untuk melihat antarmuka.
4. Untuk menjalankan API Vercel secara lokal, gunakan Vercel CLI dengan `vercel dev`; endpoint `/api/github` dan `/api/contact` tidak dilayani oleh Vite saja.

`pnpm build` membuat situs statis di `dist/`.

## Konten

- Tautan sosial dan profil situs: `src/config/site.ts`.
- Proyek akhir yang faktanya bersumber dari CV: `src/config/site.ts`.
- Artikel blog: tambahkan file Markdown ke `src/content/blog/`.

Format frontmatter artikel:

```md
---
title: "Judul"
description: "Ringkasan singkat untuk arsip dan pratinjau."
date: "2026-10-15"
slug: "judul"
tags: ["catatan"]
draft: true
---

Isi artikel dalam Markdown.
```

Slug harus unik. Artikel `draft: true` tidak muncul pada arsip publik. Renderer mendukung paragraf, heading, daftar, dan blok kode.

## API dan environment

GitHub API membaca repo publik `NawfalFaiz30`; tidak membutuhkan token. Respons di-cache melalui header CDN selama lima menit dengan stale-while-revalidate.

Form kontak memakai Resend. Salin `.env.example` ke `.env.local` untuk pengembangan dengan Vercel CLI, lalu isi:

- `CONTACT_TO_EMAIL`: alamat penerima pesan.
- `CONTACT_FROM_EMAIL`: alamat pengirim yang sudah diverifikasi pada Resend.
- `RESEND_API_KEY`: API key Resend, hanya di environment server.

Jangan commit `.env.local`. Honeypot, validasi server, batas panjang, persetujuan, dan rate limit in-memory lima pesan per sepuluh menit tersedia. Rate limit in-memory adalah perlindungan dasar dan dapat direset ketika fungsi serverless berpindah instance.

## Deploy

Hubungkan repository ke Vercel dan tambahkan variabel environment di atas pada project settings. Atur domain `nawfalulinnuhafaiz.my.id` setelah kepemilikan, DNS, dan HTTPS diverifikasi. Domain pada metadata dan sitemap saat ini adalah target PRD, bukan bukti bahwa domain sudah aktif.

## Catatan konten

CV dan foto profil yang diberikan disimpan di `public/cv/` dan `public/images/`. Halaman karya sastra hanya menampilkan pengalaman menulis yang tercantum di CV; judul novel, sinopsis, tautan penerbit, serta kanal sosial kosong tidak dikarang.

