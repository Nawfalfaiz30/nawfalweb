---
title: "Menghubungkan counting dan pembacaan Kertas C Plano"
description: "Catatan tentang rancangan sistem akhir kuliah yang menggabungkan ESP32, pembacaan citra, dan validasi data suara."
date: "2026-10-15"
slug: "menghubungkan-counting-dan-pembacaan-plano"
tags: ["Proyek Akhir", "ESP32", "Image Processing"]
draft: false
---

Proyek akhir saya berangkat dari dua catatan yang perlu dibandingkan: jumlah pemilih yang dihitung petugas dan angka yang tertulis pada Kertas C Plano. Saya merancang alur yang menghubungkan perangkat counting dengan aplikasi web agar data dari kedua sumber bisa diperiksa bersama.

## Dua sumber data

Perangkat counting menggunakan ESP32, tombol tambah dan koreksi, LCD 16×2, serta buzzer. Jumlah yang tercatat ditampilkan pada LCD dan dikirim melalui Wi-Fi dalam format JSON. Di sisi lain, petugas mengunggah foto Kertas C Plano melalui aplikasi web.

Untuk membaca formulir, proyek ini menguji Tesseract OCR dan GPT-4o Vision API. Hasil ekstraksi angka kemudian dibandingkan dengan data counting. Jika selisih melewati ambang yang ditentukan, sistem menandai data agar diperiksa kembali, bukan langsung menganggapnya benar.

## Apa yang dipelajari dari pengujian

Buku PA melaporkan akurasi rata-rata 96,25% pada pengolahan citra. Kesesuaian antara data counting dan hasil pembacaan tercatat 100% pada kondisi selisih berada dalam toleransi lima persen. Angka ini menggambarkan hasil pengujian proyek, bukan jaminan kinerja untuk setiap dokumen atau kondisi lapangan.

Kualitas foto tetap berpengaruh. Gambar yang jelas dan fokus membantu proses pembacaan, sementara citra buram atau kompleks dapat menyulitkan Tesseract. Karena itu, hasil pembacaan mesin perlu disertai validasi dan jalur pemeriksaan manual.

## Langkah berikutnya

Pengembangan yang disarankan dalam buku PA mencakup koreksi perspektif, peningkatan pra-pemrosesan gambar, antarmuka yang lebih mudah dipakai petugas, dan penguatan keamanan aplikasi web. Bagi saya, bagian penting dari proyek ini bukan hanya membuat komponen saling terhubung, tetapi juga menentukan kapan hasil sistem perlu ditinjau manusia.

Sumber: buku Proyek Akhir, abstrak dan Bab III–V (2025). Studi kasus lengkap tersedia di halaman Proyek.

