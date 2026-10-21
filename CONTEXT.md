# CONTEXT.md — Lost & Found Campus

Dokumen konteks untuk prototype frontend **Sistem Lost & Found Campus**.
Group G1 · Software Development Life Cycle · Universitas Cakrawala.

Dokumen ini menjelaskan **dari mana setiap keputusan di kode berasal**, supaya siapa pun
(anggota tim baru, dosen, atau AI assistant) bisa langsung paham tanpa membaca ulang
seluruh dokumen P9–P13.

---

## 1. Ringkasan proyek

Mahasiswa yang kehilangan barang di kampus saat ini harus datang langsung ke pos security
untuk melapor maupun sekadar menanyakan status, sementara staff security mencatat barang
temuan secara manual di buku tulis. Akibatnya record sulit dicari saat barang menumpuk,
pertanyaan berulang setiap hari membuat staff kewalahan, dan ada risiko barang diserahkan
kepada orang yang hanya mengaku sebagai pemilik.

Prototype ini adalah **frontend** dari sistem yang dirancang untuk mengatasi masalah
tersebut: mahasiswa dapat melapor dan memantau status dari mana saja, staff dapat mencatat
dan mencari record dengan cepat, dan penyerahan barang dikunci oleh checklist verifikasi.

**Batasan penting:** frontend saja. Tidak ada backend, database, maupun autentikasi.
Seluruh data adalah **data dummy** yang disimpan di `localStorage` browser.

---

## 2. Sumber kebenaran (source of truth)

Seluruh fitur di aplikasi ini diturunkan dari dokumen kelompok, bukan dari asumsi bebas:

| Tahap | Isi yang dipakai |
|---|---|
| **P9** — Requirements Discovery | Interview raw notes (I1–I10), observation (O1–O12), findings F1–F9, needs N1–N8, pain points P1–P8, constraints C1–C5 |
| **P10** — Requirements Documentation | Requirement R1–R10, NFR1–NFR4, user story US1–US7, acceptance criteria AC1.1–AC7.2, traceability matrix |
| **P11** — Prioritized Backlog | Change injection Campus Security → user story baru **US-08** (verifikasi bukti kepemilikan barang high-value) dan status baru "Menunggu Verifikasi Bukti" |
| **P12** — Sprint Planning | Sprint Goal dan sprint backlog (US-01, US-03, US-08, US-06, US-04, US-02) |

> **Aturan kerja:** jangan menambah fitur yang tidak punya jejak ke evidence P9–P11.
> Kalau butuh sesuatu yang belum ada evidence-nya, catat sebagai Open Question, jangan
> langsung dikodekan seolah-olah fakta stakeholder.

---

## 3. Cara menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install      # sekali saja
npm run dev      # buka http://localhost:5173
```

Perintah lain:

```bash
npm run build    # hasil produksi ke folder dist/
npm run preview  # cek hasil build secara lokal
```

Di dalam aplikasi:

- **Role switcher** di sidebar untuk berpindah antara *Mahasiswa* dan *Staff Security*.
  Ini bukan login — hanya pengganti autentikasi supaya kedua sisi alur bisa didemokan.
- **Reset data** di bawah sidebar mengembalikan seluruh data ke kondisi awal.
- Menu **Traceability** memperlihatkan peta evidence → requirement → story → AC → layar.

---

## 4. Struktur folder

```
SDLC_KLMPK01/
├── index.html                      Entry HTML (Vite)
├── vite.config.js
├── package.json
├── CONTEXT.md                      ← dokumen ini
├── README.md
└── src/
    ├── main.jsx                    Bootstrap React + HashRouter + StoreProvider
    ├── App.jsx                     Definisi seluruh route
    ├── index.css                   Design token + seluruh style (light & dark)
    ├── data/
    │   └── seed.js                 Konstanta domain + DATA DUMMY
    ├── store/
    │   └── StoreContext.jsx        State global + SELURUH ATURAN BISNIS
    ├── components/
    │   ├── Layout.jsx              Sidebar, topbar, notifikasi, toast
    │   ├── Icon.jsx                Ikon SVG inline
    │   └── ui.jsx                  Card, Badge, Field, Timeline, Modal, dll.
    └── pages/
        ├── Traceability.jsx
        ├── student/
        │   ├── Beranda.jsx         R10 · US7
        │   ├── LaporKehilangan.jsx R1  · US1
        │   ├── LaporanSaya.jsx     R5  · US2
        │   ├── DetailLaporan.jsx   R5, R6 · US2
        │   └── BarangTemuan.jsx    R7  · US6
        └── staff/
            ├── Dashboard.jsx
            ├── CatatTemuan.jsx         R2, R9 · US3
            ├── CariRecord.jsx          R3 · US4
            ├── DaftarLaporan.jsx       R4 · US4
            ├── DetailLaporanStaff.jsx  R4 · US4
            └── Verifikasi.jsx          R8, R9 · US5, US-08
```

**Aturan arsitektur:** semua perubahan state dan aturan bisnis tinggal di
`src/store/StoreContext.jsx`. Komponen halaman hanya menampilkan data dan memanggil aksi.
Kalau ada acceptance criteria baru, tempatnya di store, bukan disebar di tiap halaman.

---

## 5. Model data

Empat koleksi utama, semuanya di dalam satu objek state:

### `items` — barang temuan (R2)
| Field | Keterangan |
|---|---|
| `id` | `ITM-00x` |
| `jenis`, `warna`, `merek` | identitas barang |
| `deskripsiUmum` | deskripsi yang aman disebut ke pelapor |
| `detailRahasia` | **hanya staff** — isi barang / ciri kunci verifikasi (NFR1, C4) |
| `tanggalDitemukan`, `waktuDitemukan`, `lokasiDitemukan` | kapan & di mana |
| `namaPenyerah` | siapa yang menyerahkan |
| `lokasiPenyimpanan` | rak/brankas fisik — **wajib** (AC3.2) |
| `highValue` | otomatis `true` untuk HP, Laptop, Dompet, KTM (AC3.3) |
| `status` | `Disimpan` → `Dicocokkan` → `Menunggu Verifikasi Bukti` → `Diserahkan` |
| `matchedReportId` | laporan yang dicocokkan |

### `reports` — laporan kehilangan (R1)
| Field | Keterangan |
|---|---|
| `id` | `LAP-00x` |
| `jenis`, `warna`, `merek`, `ciriKhusus` | ciri barang |
| `areaPerkiraan`, `tanggalHilang`, `waktuDari`, `waktuSampai` | **boleh perkiraan** (C5, AC1.2) |
| `status` | `Dilaporkan` → `Kemungkinan Cocok` → `Menunggu Verifikasi Bukti` → `Siap Diambil` → `Selesai` / `Klaim Ditolak` |
| `matchedItemId` | barang yang dicocokkan |
| `riwayat[]` | jejak audit setiap perubahan |

### `verifications` — hasil verifikasi klaim (R8, US-08)
Mencatat `detailCocok`, `lokasiCocok`, `catatan`, dan untuk high-value tambahan
`jenisBukti`, `hasilBukti`, `petugas`, `waktu`.

### `notifications` — pemberitahuan ke pelapor (R6)
Dibuat otomatis saat kecocokan dikonfirmasi, saat verifikasi selesai, dan saat serah terima.

---

## 6. Alur utama (state machine)

```
Mahasiswa lapor                          → Dilaporkan
Staff konfirmasi kandidat cocok
   ├─ barang biasa                       → Kemungkinan Cocok
   └─ barang high-value                  → Menunggu Verifikasi Bukti
Staff isi checklist verifikasi
   ├─ lolos                              → Siap Diambil
   └─ tidak lolos                        → Klaim Ditolak (barang kembali Disimpan)
Staff tandai diserahkan (hanya dari Siap Diambil)
                                         → Selesai
```

Alur high-value mengikuti kartu change injection P11: bukti diperiksa **langsung di pos**
oleh petugas, mahasiswa tidak mengunggah apa pun, dan sistem hanya mencatat hasilnya
(jenis bukti, valid/tidak, nama petugas, waktu).

---

## 7. Acceptance criteria yang benar-benar dipaksakan kode

Ini bagian terpenting untuk audit dosen. Setiap baris di bawah bisa dibuktikan dengan
mencoba langsung di aplikasi.

| AC | Aturan | Letak di kode |
|---|---|---|
| AC1.1 | Jenis + minimal satu ciri → tersimpan dengan ID dan status "Dilaporkan" | `LaporKehilangan.jsx` `validate()` |
| AC1.2 | Rentang jam & area umum diterima; waktu/lokasi persis tidak pernah diminta | `LaporKehilangan.jsx` (field opsional) |
| AC1.3 | Tanpa jenis barang → laporan ditolak, field ditandai merah | `LaporKehilangan.jsx` `validate()` |
| AC2.1 | Status tampil sebagai salah satu tahap pada timeline | `ui.jsx` `StatusTimeline` |
| AC2.2 | Konfirmasi kecocokan otomatis mengirim notifikasi pribadi | `StoreContext.jsx` `confirmMatch()` |
| AC2.3 | Notifikasi & tampilan mahasiswa tidak memuat isi/detail rahasia | `confirmMatch()`, `DetailLaporan.jsx` |
| AC3.1 | Record tersimpan dengan ID unik bila field wajib lengkap | `CatatTemuan.jsx`, `addItem()` |
| AC3.2 | Tanpa lokasi penyimpanan → record tidak tersimpan | `CatatTemuan.jsx` `validate()` |
| AC3.3 | HP/Laptop/Dompet/KTM otomatis high-value + wajib penyimpanan terpisah | `isHighValue()`, `CatatTemuan.jsx` |
| AC4.1 | Pencarian/filter hanya menampilkan record sesuai + lokasi penyimpanan | `CariRecord.jsx` |
| AC4.2 | Kandidat = jenis sama + ditemukan pada/setelah perkiraan kehilangan | `StoreContext.jsx` `findCandidates()` |
| AC4.3 | Status tidak berubah sebelum staff menekan "Konfirmasi cocok" | `DetailLaporanStaff.jsx` |
| AC5.1 | Form verifikasi: detail spesifik, lokasi hilang, catatan staff | `Verifikasi.jsx` |
| AC5.2 | Tidak bisa ditandai diserahkan bila verifikasi belum lolos | `StoreContext.jsx` `markHandover()` |
| AC5.3 | High-value memunculkan langkah pemeriksaan bukti tambahan | `Verifikasi.jsx` (fieldset high-value) |
| AC6.1 | Daftar mahasiswa hanya jenis, area, tanggal ditemukan | `BarangTemuan.jsx` |
| AC6.2 | Detail rahasia tidak pernah muncul di tampilan mahasiswa | `BarangTemuan.jsx`, `DetailLaporan.jsx` |
| AC7.1 | Beranda memuat cara melapor & cara menyerahkan barang | `Beranda.jsx` |
| AC7.2 | Beranda memuat lokasi pos security | `Beranda.jsx` |

Constraint yang ikut dijaga: **C1** (barang tidak diserahkan hanya karena mengaku),
**C2/C3** (high-value lebih ketat & disimpan terpisah), **C4/NFR1** (detail rahasia
tidak dipublikasikan), **C5** (lokasi/waktu boleh perkiraan), **NFR2** (hanya staff yang
bisa mencatat, mengubah status, dan menyelesaikan klaim).

---

## 8. Skenario demo (urutan yang disarankan saat presentasi)

1. **Sebagai Mahasiswa** → *Beranda*: tunjukkan kanal resmi & lokasi pos (AC7.1, AC7.2).
2. *Lapor Kehilangan*: coba kirim tanpa jenis barang → ditolak (**AC1.3**). Lalu isi
   "Tumbler" + ciri khusus, waktu cukup rentang jam, area "Perpustakaan" → tersimpan (**AC1.1, AC1.2**).
3. *Barang Temuan*: tunjukkan hanya ada 3 kolom — tidak ada detail rahasia (**AC6.1**).
4. **Ganti ke Staff Security** → *Laporan Kehilangan* → buka laporan tumbler tadi.
   Kandidat muncul otomatis, tapi status belum berubah (**AC4.3**). Klik *Konfirmasi cocok*.
5. *Verifikasi Klaim*: isi checklist. Kalau salah satu "Tidak cocok" → klaim ditolak dan
   barang kembali disimpan (**AC5.2**).
6. Ulangi dengan laporan **LAP-004 (Handphone)** untuk memperlihatkan alur **high-value**:
   muncul langkah pemeriksaan bukti kepemilikan (**AC5.3 / US-08 dari P11**).
7. Setelah lolos → *Tandai diserahkan* → status **Selesai**.
8. **Kembali ke Mahasiswa**: lonceng notifikasi berisi pemberitahuan tanpa detail rahasia
   (**AC2.2, AC2.3**), dan timeline laporan sudah berpindah (**AC2.1**).
9. Tutup dengan menu **Traceability**.

---

## 9. Yang sengaja TIDAK dibuat

Mengikuti batasan scope P10 ("Out of Scope") dan sifat tugas ini:

- Backend, REST API, dan database — prototype frontend saja.
- Autentikasi/otorisasi sungguhan (peran dipilih manual lewat switcher).
- Upload foto barang — batasannya masih **Open Question Q4** di P10.
- Prosedur teknis pengamanan fisik ruang penyimpanan (**Q5**, di luar scope).
- Kebijakan barang yang tidak diklaim dalam jangka waktu tertentu (**Q6**).
- Notifikasi ke WhatsApp/grup — channel-nya masih **asumsi A4**, jadi notifikasi
  hanya ditampilkan di dalam aplikasi.
- Pengantaran barang ke pemilik dan penetapan pemilik otomatis tanpa keputusan staff.

---

## 10. Open question yang masih terbawa

| ID | Pertanyaan | Dampak ke kode |
|---|---|---|
| Q1 | Berapa lama rata-rata staff mencari satu barang saat ini? | NFR4 belum punya target angka, jadi tidak ada klaim performa di UI |
| Q2 | Bukti kepemilikan apa saja yang dianggap valid? | Daftar `JENIS_BUKTI` di `seed.js` masih dugaan, perlu konfirmasi stakeholder |
| Q3 | Sudah ada channel/grup resmi lost & found? | Konten Beranda mungkin cukup merujuk kanal yang sudah ada |
| Q4 | Foto barang boleh dibagikan atau tidak? | Fitur foto belum dibuat sama sekali |
| Q5 | Prosedur akses fisik barang high-value | Di luar scope, hanya dicatat lokasi penyimpanannya |
| Q6 | Berapa lama barang disimpan bila tidak diklaim? | Belum ada mekanisme kedaluwarsa |

---

## 11. Catatan untuk kontributor berikutnya

- Kalau menambah jenis barang baru yang bernilai tinggi, tambahkan ke
  `HIGH_VALUE_JENIS` di `src/data/seed.js` — penandaan otomatis dan alur verifikasi
  tambahan akan ikut berlaku tanpa perubahan lain.
- Setiap halaman wajib mencantumkan `<TraceChips>` berisi ID requirement/story/AC yang
  dipenuhinya. Ini yang membuat prototype bisa diaudit terhadap P10.
- Jangan pernah merender `detailRahasia` di komponen mana pun di bawah
  `src/pages/student/`. Itu pelanggaran langsung terhadap NFR1, C4, dan AC6.2.
- Data dummy di `seed.js` boleh ditambah, tapi jangan dipakai sebagai bukti wawancara.
  Raw evidence tetap ada di dokumen P9.
