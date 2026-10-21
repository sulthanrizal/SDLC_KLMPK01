# TASKS.md — Pembagian Tugas Sprint & Papan Trello

Group G1 · Lost & Found Campus · SDLC Universitas Cakrawala
Anggota: **6 orang** · Sprint: **2 minggu** · Kapasitas setelah capacity shock: **14 poin**

Dokumen ini menurunkan Sprint Backlog P12 menjadi **sprint task (ST)** yang bisa dipegang
satu orang, lengkap dengan reviewer, file yang disentuh, dan acceptance criteria sebagai
checklist. Format di Bagian 6 bisa langsung di-paste ke Trello.

---

## 1. Dasar pembagian

Dari P12, setelah capacity shock 20 → 14 poin, item yang masuk sprint adalah:

| User Story | Poin | Status |
|---|---|---|
| US-01 Melaporkan kehilangan barang | 2 | Masuk sprint |
| US-03 Menginput barang temuan + penanda high-value | 3 | Masuk sprint |
| US-08 Verifikasi bukti kepemilikan high-value | 5 | Masuk sprint |
| US-06 Mahasiswa melihat daftar barang temuan | 2 | Masuk sprint |
| US-02 Status laporan & notifikasi | 2 | Masuk sprint |
| US-04 Cari record & kandidat cocok | 3 | **Dikeluarkan** (capacity shock) |
| US-05 Verifikasi barang biasa | 8 | Tidak muat kapasitas |
| US-07 Informasi kanal resmi | 2 | Not Now sejak P11 |
| **Total sprint** | **14** | 14 / 14 |

---

## 2. Pembagian per anggota

| Anggota | Sprint Task | Poin | Reviewer |
|---|---|---|---|
| **Adzril Adzim Hendrynov** | ST-01 | 2 | Arsalla |
| **Arsalla Jumanuar Sintaka** | ST-02, ST-03 | 3 | Ferdilla, Akbar |
| **Ferdilla Ayu Puspita** | ST-06 | 2 | Adzril |
| **M. Akbar Al Ghazali** | ST-07, ST-08 | 2 | Adzril, Ferdilla |
| **Muhammad Afiq Aqhdaq** | ST-05 | 2 | Sulthan |
| **Sulthan Rizal Halfa Ilmi** | ST-04 | 3 | Afiq |
| | **Total** | **14** | |

Setiap anggota me-review minimal satu PR anggota lain, sesuai syarat P13
("Reviews must come from another group member").

---

## 3. Rincian sprint task

### ST-01 · Form lapor kehilangan
- **Owner:** Adzril Adzim Hendrynov · **Reviewer:** Arsalla · **Poin:** 2
- **Story:** US-01 → R1 → N1, N2 → F2, F3, C5
- **File:** `src/pages/student/LaporKehilangan.jsx`
- **Branch:** `feat/st-01-lapor-kehilangan`
- **Checklist (AC):**
  - [ ] AC1.1 — jenis + minimal satu ciri → tersimpan dengan ID dan status "Dilaporkan"
  - [ ] AC1.2 — rentang jam & area umum diterima, waktu/lokasi persis tidak pernah diminta
  - [ ] AC1.3 — tanpa jenis barang, laporan ditolak dan field wajib ditandai
- **Dependency:** tidak ada. Jadi sumber data untuk ST-07 dan ST-08.

### ST-02 · Form catat barang temuan
- **Owner:** Arsalla Jumanuar Sintaka · **Reviewer:** Ferdilla · **Poin:** 2
- **Story:** US-03 → R2 → N5 → F7, F8
- **File:** `src/pages/staff/CatatTemuan.jsx`
- **Branch:** `feat/st-02-catat-temuan`
- **Checklist (AC):**
  - [ ] AC3.1 — record tersimpan dengan ID unik bila field wajib lengkap
  - [ ] AC3.2 — tanpa lokasi penyimpanan, record tidak tersimpan
  - [ ] Field sesuai yang dicatat staff saat ini: jenis, waktu & lokasi ditemukan, deskripsi umum, nama penyerah
- **Dependency:** prasyarat ST-04, ST-05, dan ST-06.

### ST-03 · Penandaan high-value otomatis
- **Owner:** Arsalla Jumanuar Sintaka · **Reviewer:** Akbar · **Poin:** 1
- **Story:** US-03 → R9 → C2, C3 → F9
- **File:** `src/data/seed.js` (`HIGH_VALUE_JENIS`), `src/store/StoreContext.jsx` (`isHighValue`), `src/pages/staff/CatatTemuan.jsx`
- **Branch:** `feat/st-03-penanda-high-value`
- **Checklist (AC):**
  - [ ] AC3.3 — HP, laptop, dompet, KTM otomatis ditandai high-value
  - [ ] Lokasi penyimpanan terpisah wajib diisi untuk barang high-value
  - [ ] Badge high-value tampil di record dan di halaman verifikasi
- **Dependency:** ST-02. **Memblokir ST-04 dan ST-05** — tanpa penanda ini alur high-value tidak bisa jalan.

### ST-04 · State machine verifikasi & kunci serah terima
- **Owner:** Sulthan Rizal Halfa Ilmi · **Reviewer:** Afiq · **Poin:** 3
- **Story:** US-08 → R8 (diperluas) → N7 → F9, C1, P7 + kartu P11
- **File:** `src/store/StoreContext.jsx` (`saveVerification`, `markHandover`, `confirmMatch`)
- **Branch:** `feat/st-04-state-verifikasi`
- **Checklist (AC):**
  - [ ] Status baru "Menunggu Verifikasi Bukti" berlaku khusus barang high-value
  - [ ] AC5.2 — barang tidak dapat ditandai diserahkan bila verifikasi belum diisi atau tidak lolos
  - [ ] Klaim ditolak → barang kembali berstatus "Disimpan", kecocokan dilepas
  - [ ] Setiap perubahan tercatat di `riwayat[]` laporan (jejak audit)
- **Dependency:** ST-03.

### ST-05 · Form pemeriksaan bukti kepemilikan
- **Owner:** Muhammad Afiq Aqhdaq · **Reviewer:** Sulthan · **Poin:** 2
- **Story:** US-08 → R9 → kartu P11
- **File:** `src/pages/staff/Verifikasi.jsx`
- **Branch:** `feat/st-05-form-bukti-high-value`
- **Checklist (AC):**
  - [ ] AC5.1 — tersedia isian kecocokan detail spesifik, kecocokan lokasi hilang, dan catatan staff
  - [ ] AC5.3 — barang high-value memunculkan langkah verifikasi tambahan sebelum dapat diserahkan
  - [ ] Tercatat: jenis bukti, hasil valid/tidak, nama petugas, waktu
  - [ ] Mahasiswa tidak mengunggah apa pun — bukti diperiksa langsung di pos
- **Dependency:** ST-03, ST-04.

### ST-06 · Daftar barang temuan untuk mahasiswa
- **Owner:** Ferdilla Ayu Puspita · **Reviewer:** Adzril · **Poin:** 2
- **Story:** US-06 → R7 → N8 → F5, C4, NFR1
- **File:** `src/pages/student/BarangTemuan.jsx`
- **Branch:** `feat/st-06-daftar-barang-temuan`
- **Checklist (AC):**
  - [ ] AC6.1 — hanya menampilkan jenis barang, area ditemukan, dan tanggal ditemukan
  - [ ] AC6.2 — detail yang ditandai rahasia tidak pernah muncul
  - [ ] Filter jenis dan area berfungsi
  - [ ] Barang berstatus "Diserahkan" tidak lagi tampil
- **Dependency:** ST-02.

### ST-07 · Timeline status laporan
- **Owner:** M. Akbar Al Ghazali · **Reviewer:** Adzril · **Poin:** 1
- **Story:** US-02 → R5 → N1 → F3, P1
- **File:** `src/components/ui.jsx` (`StatusTimeline`), `src/pages/student/LaporanSaya.jsx`, `src/pages/student/DetailLaporan.jsx`
- **Branch:** `feat/st-07-timeline-status`
- **Checklist (AC):**
  - [ ] AC2.1 — status tampil sebagai salah satu dari: Dilaporkan, Kemungkinan Cocok, Siap Diambil, Selesai
  - [ ] Status "Menunggu Verifikasi Bukti" hanya muncul untuk barang high-value
  - [ ] Status "Klaim Ditolak" ditampilkan dengan penjelasan
- **Dependency:** ST-01, ST-04.

### ST-08 · Notifikasi pelapor
- **Owner:** M. Akbar Al Ghazali · **Reviewer:** Ferdilla · **Poin:** 1
- **Story:** US-02 → R6 → N1 → F6
- **File:** `src/store/StoreContext.jsx` (pembuatan notifikasi), `src/components/Layout.jsx` (panel lonceng)
- **Branch:** `feat/st-08-notifikasi-pelapor`
- **Checklist (AC):**
  - [ ] AC2.2 — staff menandai kemungkinan cocok → pelapor menerima pemberitahuan pribadi
  - [ ] AC2.3 — pemberitahuan tidak memuat isi barang atau detail yang ditandai rahasia
  - [ ] Notifikasi high-value mengingatkan untuk membawa bukti kepemilikan
  - [ ] Penanda belum dibaca dan aksi "tandai dibaca" berfungsi
- **Dependency:** ST-04.

---

## 4. Urutan pengerjaan (karena ada dependency)

```
Minggu 1   ST-01 (Adzril)  ─┐
           ST-02 (Arsalla) ─┼─→ ST-03 (Arsalla) ─→ ST-04 (Sulthan)
           ST-06 (Ferdilla) ┘                            │
                                                         ▼
Minggu 2                              ST-05 (Afiq) ·  ST-07, ST-08 (Akbar)
```

Yang paling genting: **ST-03 memblokir ST-04 dan ST-05** (total 5 poin). Kalau ST-03
molor, separuh Sprint Goal ikut tertahan. Selesaikan ST-03 paling lambat hari ke-4.

Catatan risiko dari P12: scope 14 dari kapasitas 14 berarti **tidak ada buffer**.

---

## 5. Definition of Done

Sebuah kartu baru boleh dipindah ke **DONE** bila keempatnya terpenuhi:

1. Pull Request sudah **di-review** oleh anggota lain yang ditunjuk.
2. PR sudah **merged** ke `main`. PR yang belum merged bukan Done.
3. Seluruh **acceptance criteria** pada checklist kartu sudah dicek dan terbukti jalan.
4. `npm run build` lolos tanpa error.

Isi wajib deskripsi PR di GitHub (syarat P13):

```
Related Sprint Task : ST-__ → US-__ → R__
What Changed        : ...
Why                 : ...
How It Was Verified : AC__ dicek dengan langkah ...
Evidence            : screenshot / langkah uji
```

---

## 6. Papan Trello

### List yang dibuat

```
BACKLOG
TODO (Sprint 1)
IN PROGRESS
REVIEW
DONE
```

### Cara cepat membuat kartu

Buka list **TODO**, klik "Add a card", lalu **paste seluruh blok di bawah sekaligus** —
Trello akan menawarkan membuat satu kartu per baris:

```
ST-01 · Form lapor kehilangan · Adzril · 2 pts
ST-02 · Form catat barang temuan · Arsalla · 2 pts
ST-03 · Penandaan high-value otomatis · Arsalla · 1 pt
ST-04 · State machine verifikasi & kunci serah terima · Sulthan · 3 pts
ST-05 · Form pemeriksaan bukti kepemilikan · Afiq · 2 pts
ST-06 · Daftar barang temuan untuk mahasiswa · Ferdilla · 2 pts
ST-07 · Timeline status laporan · Akbar · 1 pt
ST-08 · Notifikasi pelapor · Akbar · 1 pt
```

Masukkan juga ke list **BACKLOG** (tidak dikerjakan sprint ini, supaya trade-off P12 terlihat):

```
US-04 · Cari record & kandidat cocok · 3 pts · dikeluarkan karena capacity shock
US-05 · Verifikasi pemilik barang biasa · 8 pts · tidak muat kapasitas
US-07 · Informasi kanal resmi · 2 pts · Not Now sejak P11
```

### Isi tiap kartu

- **Member:** owner tugas
- **Label:** `US-01` … `US-08`, plus `high-value` untuk ST-03/04/05
- **Checklist "Acceptance Criteria":** salin dari Bagian 3 dokumen ini
- **Checklist "Definition of Done":** Reviewed / Merged / AC checked / Build lolos
- **Description:** tulis rantai traceability, contoh:
  `F9, C1, C2 → N7 → R8 → US-08 → AC5.1–AC5.3 → ST-04 → PR #__`
- **Attachment:** link Pull Request GitHub setelah PR dibuat

### Contoh deskripsi kartu ST-04

```
Rantai: F9, C1, C2, P7 + kartu P11 → N7 → R8 (diperluas), R9 → US-08 → ST-04

Mengunci penyerahan barang high-value: status tidak bisa berpindah ke
"Diserahkan" sebelum hasil verifikasi bukti tercatat valid.

File  : src/store/StoreContext.jsx
Branch: feat/st-04-state-verifikasi
Owner : Sulthan · Reviewer: Afiq · 3 pts
Blocked by: ST-03
```

---

## 7. Catatan jujur soal evidence P13

Repository saat ini berisi **satu commit awal** yang memuat seluruh prototype. Untuk P13,
dosen menilai riwayat Pull Request yang nyata — "Jangan membuat ulang riwayat pekerjaan
seolah-olah dilakukan di pertemuan sebelumnya."

Supaya evidence-nya sah, jangan mengarang PR mundur. Pilih salah satu:

- **Opsi A (disarankan).** Perlakukan commit awal sebagai *scaffolding*, lalu tiap anggota
  mengerjakan **peningkatan nyata** pada area miliknya lewat branch + PR sendiri:
  perbaikan validasi, penanganan kasus tepi, perbaikan aksesibilitas, atau penulisan
  catatan uji. Setiap PR tetap merujuk ST dan AC-nya, dan riwayatnya jujur.
- **Opsi B.** Kosongkan kembali area tiap fitur, lalu tiap anggota mengimplementasikan
  ulang bagiannya sebagai PR pertama mereka. Lebih memakan waktu, tetapi riwayatnya
  paling bersih.

Apa pun yang dipilih, status di Trello harus mencerminkan kondisi GitHub yang sebenarnya.
Kartu tidak boleh DONE kalau PR-nya masih open.
