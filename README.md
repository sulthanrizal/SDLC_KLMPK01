# Lost & Found Campus

Prototype **frontend** sistem Lost & Found Campus.
Group G1 · Software Development Life Cycle · Universitas Cakrawala.

Aplikasi ini menerjemahkan hasil requirements discovery (P9) dan requirements
documentation (P10), termasuk change injection P11, menjadi antarmuka yang bisa dijalankan
dan didemokan.

> **Frontend saja.** Tidak ada backend, database, atau autentikasi. Seluruh data adalah
> **data dummy** yang disimpan di `localStorage` browser.

---

## Menjalankan

Butuh Node.js 18+.

```bash
npm install
npm run dev
```

Buka http://localhost:5173

```bash
npm run build     # build produksi ke dist/
npm run preview   # cek hasil build
```

---

## Fitur

**Mahasiswa**

- Beranda berisi kanal resmi: cara melapor, cara menyerahkan barang temuan, lokasi pos security *(R10)*
- Lapor kehilangan — lokasi dan waktu boleh perkiraan *(R1)*
- Pantau status laporan: Dilaporkan → Kemungkinan Cocok → Siap Diambil → Selesai *(R5)*
- Notifikasi pribadi saat ada barang mirip ditemukan *(R6)*
- Daftar barang temuan tanpa detail rahasia *(R7)*

**Staff Security**

- Dashboard operasional pos
- Catat barang temuan beserta lokasi penyimpanan fisik *(R2)*
- Cari dan filter record berdasarkan jenis, warna, lokasi, tanggal *(R3)*
- Saran kandidat kecocokan — keputusan akhir tetap di tangan staff *(R4)*
- Checklist verifikasi klaim sebelum barang boleh diserahkan *(R8)*
- Penandaan otomatis barang high-value + pencatatan bukti kepemilikan *(R9, US-08)*

Menu **Traceability** di dalam aplikasi memperlihatkan peta lengkap
evidence P9 → requirement P10 → user story → acceptance criteria → layar.

---

## Tech stack

- React 18 + Vite
- React Router (HashRouter)
- CSS murni dengan design token, mendukung tema terang & gelap
- Tanpa UI library dan tanpa dependency runtime tambahan

---

## Dokumentasi

Penjelasan lengkap — asal-usul setiap fitur, model data, state machine, daftar
acceptance criteria yang dipaksakan kode, skenario demo, dan open question yang masih
terbuka — ada di **[CONTEXT.md](CONTEXT.md)**.

---

## Anggota kelompok

| No | Nama | Area kepemilikan |
|---|---|---|
| 1 | Adzril Adzim Hendrynov | Lapor kehilangan (US-01) |
| 2 | Arsalla Jumanuar Sintaka | Catat barang temuan & penandaan high-value (US-03) |
| 3 | Ferdilla Ayu Puspita | Daftar barang temuan mahasiswa (US-06) |
| 4 | M. Akbar Al Ghazali | Status laporan & notifikasi (US-02) |
| 5 | Muhammad Afiq Aqhdaq | Form pemeriksaan bukti high-value (US-08) |
| 6 | Sulthan Rizal Halfa Ilmi | State machine verifikasi & kunci serah terima (US-08) |

Pembagian tugas lengkap beserta sprint task, reviewer, dan format kartu Trello ada di
**[TASKS.md](TASKS.md)**.
