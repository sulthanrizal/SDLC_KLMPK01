# Catatan Uji Manual — ST-01 Form Lapor Kehilangan

**Sprint Task:** ST-01 · **Owner:** Adzril Adzim Hendrynov · **Reviewer:** Arsalla
**Rantai traceability:** F2, F3, C5 -> N1, N2 -> R1 -> US-01 -> AC1.1, AC1.2, AC1.3 -> ST-01
**File:** `src/pages/student/LaporKehilangan.jsx`
**Tanggal uji:** 24 Oktober 2026 · **Environment:** Vite dev server (Chrome/Chromium via Playwright)

---

## A. Acceptance criteria

| # | Langkah uji | Hasil yang diamati | Status |
|---|---|---|---|
| AC1.3a | Buka `#/lapor`, langsung tekan "Kirim laporan" tanpa mengisi apa pun | Laporan tidak tersimpan. Muncul ringkasan error berisi "Jenis barang wajib dipilih", "Isi minimal satu ciri barang", "Perkiraan tanggal wajib diisi". Ketiga field ditandai merah + `aria-invalid="true"` | ✅ |
| AC1.3b | Submit form kosong lalu perhatikan fokus keyboard | Fokus pindah otomatis ke ringkasan error (`role="alert"`, ter-focus). Setiap baris error adalah tautan yang melompat ke field bersangkutan (#jenis, #ciri, #tgl) | ✅ |
| AC1.3c | Isi semua field wajib kecuali "Jenis barang", submit | Laporan ditolak, hanya `jenis` yang ditandai merah | ✅ |
| AC1.1a | Isi jenis "Tumbler" + ciri khusus "Ada stiker band di badan tumbler" + tanggal valid, submit | Laporan tersimpan dengan ID baru (LAP-006) dan status "Dilaporkan". Toast sukses muncul. Redirect ke halaman detail laporan | ✅ |
| AC1.1b | Uji validasi "minimal satu ciri": pilih jenis, kosongkan warna/merek/ciri khusus, submit | Ditolak dengan pesan "Isi minimal satu ciri barang: warna, merek, atau ciri khusus" | ✅ |
| AC1.2 | Isi form tanpa jam (waktuDari & waktuSampai kosong) dan tanpa area umum, submit | Laporan tetap tersimpan — lokasi & waktu persis tidak pernah diminta | ✅ |
| AC1.2b | Isi jam mulai "12:00" dan jam selesai "10:00" | Ditolak: "Jam selesai harus setelah jam mulai" | ✅ |

## B. Peningkatan (di luar AC — penanganan kasus tepi & aksesibilitas)

| # | Langkah uji | Hasil yang diamati | Status |
|---|---|---|---|
| E1 | Isi "Perkiraan tanggal" dengan tanggal 3 hari ke depan, submit | Ditolak: "Tanggal kehilangan tidak boleh tanggal yang akan datang." | ✅ |
| E2 | Isi kontak "bukan-nomor", submit | Ditolak: "Format nomor tidak dikenali. Gunakan nomor HP, mis. 0812-3456-7890." | ✅ |
| E3 | Isi kontak "0812-3456-7890", submit | Diterima (spasi & tanda hubung diabaikan dalam regex) | ✅ |
| E4 | Perhatikan teks bantuan di bawah textarea "Ciri khusus" | Counter tampil: "300 karakter tersisa" dan berkurang saat mengetik. `maxLength=300` mencegah kelebihan input | ✅ |
| E5 | Cek atribut ARIA field "Merek" (punya teks bantuan) | `aria-describedby` tertaut ke help text "Kosongkan bila tidak ingat." | ✅ |
| E6 | Submit form kosong, cek field yang error | Pesan error field punya `role="alert"` (diumumkan screen reader); input punya `aria-invalid="true"` | ✅ |
| E7 | Isi form (Merek "Eiger", ciri "Uji draft"), tutup tab/buka ulang `#/lapor` | Isian dipulihkan dari localStorage. Callout "Isian sebelumnya dipulihkan." tampil | ✅ |
| E8 | Setelah draft dipulihkan, tekan "Kosongkan form" | Form dikosongkan, draft dihapus dari localStorage (`null`), callout draft hilang | ✅ |
| E9 | Submit laporan valid sampai sukses | Draft terhapus otomatis (`localStorage` bersih), redirect ke detail laporan | ✅ |

## C. Build

| # | Perintah | Hasil | Status |
|---|---|---|---|
| B1 | `npm run build` | Lolos — 51 modul, output `dist/` tanpa error | ✅ |

---

## D. Bukti pendukung

- Sesi uji dijalankan pada 24 Oktober 2026 memakai Chromium (Playwright) terhadap dev server Vite.
- ID laporan yang terbentuk saat uji AC1.1a: `LAP-006` (id berurutan dari counter store).

## E. Catatan untuk reviewer

1. Perubahan validasi kasus tepi (tanggal masa depan, format kontak, batas ciri khusus) adalah **penambahan pengaman**, bukan perubahan AC. AC1.2 tetap dijaga: lokasi & waktu persis tidak pernah divalidasi ketat.
2. `Field` di `src/components/ui.jsx` diperluas secara backward-compatible (menyuntik `aria-invalid`/`aria-describedby` ke child tunggal). Halaman lain yang memakai `Field` otomatis ikut membaik tanpa perubahan kode.
3. Draft disimpan di localStorage dengan key `draft-lapor-kehilangan`; key dihapus saat form kosong atau laporan terkirim, sehingga tidak menumpuk.
