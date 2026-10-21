/* ============================================================
   seed.js — konstanta domain + seed data dummy
   Lost & Found Campus · Group G1

   CATATAN: Seluruh isi file ini adalah DATA DUMMY untuk keperluan
   prototype frontend. Tidak ada data stakeholder asli di sini.
   ============================================================ */

/* ---------- Konstanta domain ---------- */

export const AREAS = [
  'Gedung A', 'Gedung B', 'Gedung C',
  'Kantin', 'Perpustakaan', 'Lab Komputer',
  'Aula', 'Masjid Kampus', 'Parkiran Motor', 'Lapangan', 'Pos Security'
];

export const JENIS_BARANG = [
  'Dompet', 'Handphone', 'Laptop', 'KTM',
  'Tumbler', 'Kunci', 'Earphone', 'Tas', 'Jaket',
  'Payung', 'Buku Catatan', 'Kacamata', 'Charger', 'Lainnya'
];

/* C2/C3 + AC3.3 — barang high-value ditandai otomatis oleh sistem */
export const HIGH_VALUE_JENIS = ['Handphone', 'Laptop', 'Dompet', 'KTM'];

export const WARNA = [
  'Hitam', 'Putih', 'Abu-abu', 'Biru', 'Merah',
  'Hijau', 'Kuning', 'Cokelat', 'Pink', 'Ungu', 'Silver', 'Lainnya'
];

/* Status laporan kehilangan — R5 + status baru dari change injection P11 */
export const STATUS = {
  DILAPORKAN: 'Dilaporkan',
  COCOK:      'Kemungkinan Cocok',
  TUNGGU:     'Menunggu Verifikasi Bukti',
  SIAP:       'Siap Diambil',
  SELESAI:    'Selesai',
  DITOLAK:    'Klaim Ditolak'
};

/* Urutan tahapan untuk timeline status */
export const STATUS_FLOW = [
  STATUS.DILAPORKAN,
  STATUS.COCOK,
  STATUS.TUNGGU,
  STATUS.SIAP,
  STATUS.SELESAI
];

/* Status barang temuan */
export const ITEM_STATUS = {
  DISIMPAN:  'Disimpan',
  DICOCOKKAN:'Dicocokkan',
  TUNGGU:    'Menunggu Verifikasi Bukti',
  DISERAHKAN:'Diserahkan'
};

/* Jenis bukti kepemilikan untuk barang high-value (US-08, kartu P11).
   Daftar ini masih Open Question Q2 di P10 — ditandai di UI. */
export const JENIS_BUKTI = [
  'KTM (Kartu Tanda Mahasiswa)',
  'KTP / SIM',
  'Foto barang di galeri pribadi',
  'Nota / struk pembelian',
  'Kartu member di dalam barang',
  'Akun terdaftar pada perangkat',
  'Lainnya (dicatat di catatan petugas)'
];

export const PETUGAS = ['Pak Dedi', 'Pak Rahmat', 'Bu Sri', 'Pak Joko'];

/* Pengguna demo — tidak ada autentikasi nyata pada prototype ini */
export const USERS = {
  mahasiswa: { nama: 'Nabil Alviro G.', nim: '2024010045', inisial: 'NA' },
  staff:     { nama: 'Pak Dedi',        nim: 'Security · Pos Utama', inisial: 'PD' }
};

/* ---------- Seed data ---------- */
/* seed() mengembalikan objek BARU setiap kali dipanggil,
   supaya tombol "Reset data" benar-benar mengembalikan kondisi awal. */

export function seed() {
  return {
    version: 1,

    /* ---- Barang temuan yang dicatat staff (R2, R9) ---- */
    items: [
      {
        id: 'ITM-001',
        jenis: 'Dompet', warna: 'Hitam', merek: 'Eiger',
        deskripsiUmum: 'Dompet lipat dua, bahan kulit sintetis, kondisi agak lecet di sudut.',
        detailRahasia: 'Berisi kartu member Alfamart a.n. R. Aulia dan uang tunai Rp85.000.',
        tanggalDitemukan: '2026-10-19', waktuDitemukan: '16:40',
        lokasiDitemukan: 'Gedung A',
        namaPenyerah: 'Mahasiswa (tidak menyebut nama)',
        lokasiPenyimpanan: 'Brankas Pos Utama · Laci 1',
        highValue: true,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Dedi', dicatatPada: '2026-10-19T16:55:00'
      },
      {
        id: 'ITM-002',
        jenis: 'Dompet', warna: 'Hitam', merek: 'Tidak diketahui',
        deskripsiUmum: 'Dompet panjang warna hitam, ada jahitan putih di tepi.',
        detailRahasia: 'Berisi kartu perpustakaan dan foto ukuran 3x4.',
        tanggalDitemukan: '2026-10-20', waktuDitemukan: '09:15',
        lokasiDitemukan: 'Kantin',
        namaPenyerah: 'Ibu Kantin (Bu Yati)',
        lokasiPenyimpanan: 'Brankas Pos Utama · Laci 1',
        highValue: true,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Rahmat', dicatatPada: '2026-10-20T09:30:00'
      },
      {
        id: 'ITM-003',
        jenis: 'Tumbler', warna: 'Biru', merek: 'Corkcicle',
        deskripsiUmum: 'Tumbler stainless 500ml, ada stiker band di badan tumbler.',
        detailRahasia: '',
        tanggalDitemukan: '2026-10-18', waktuDitemukan: '12:20',
        lokasiDitemukan: 'Perpustakaan',
        namaPenyerah: 'Petugas Perpustakaan',
        lokasiPenyimpanan: 'Rak B · Baris 2',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Bu Sri', dicatatPada: '2026-10-18T12:45:00'
      },
      {
        id: 'ITM-004',
        jenis: 'Earphone', warna: 'Putih', merek: 'Soundcore',
        deskripsiUmum: 'Wireless earbuds dengan case charging, case sedikit kuning.',
        detailRahasia: 'Nama perangkat Bluetooth: "earbuds ikmal".',
        tanggalDitemukan: '2026-10-17', waktuDitemukan: '15:05',
        lokasiDitemukan: 'Lab Komputer',
        namaPenyerah: 'Ikmal Luthfi',
        lokasiPenyimpanan: 'Rak A · Kotak Kecil 3',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Dedi', dicatatPada: '2026-10-17T15:20:00'
      },
      {
        id: 'ITM-005',
        jenis: 'Handphone', warna: 'Hitam', merek: 'Samsung',
        deskripsiUmum: 'Handphone layar 6 inci, casing bening, kondisi menyala tetapi terkunci.',
        detailRahasia: 'Wallpaper lockscreen foto kucing oranye. Ada retak halus di pojok kanan bawah.',
        tanggalDitemukan: '2026-10-20', waktuDitemukan: '13:30',
        lokasiDitemukan: 'Aula',
        namaPenyerah: 'Panitia Seminar',
        lokasiPenyimpanan: 'Brankas Pos Utama · Laci 2',
        highValue: true,
        status: ITEM_STATUS.TUNGGU,
        matchedReportId: 'LAP-004',
        dicatatOleh: 'Pak Rahmat', dicatatPada: '2026-10-20T13:50:00'
      },
      {
        id: 'ITM-006',
        jenis: 'KTM', warna: 'Putih', merek: 'Universitas Cakrawala',
        deskripsiUmum: 'Kartu Tanda Mahasiswa, bagian sudut sedikit tertekuk.',
        detailRahasia: 'Atas nama Arsalla J. S., NIM 2024010112.',
        tanggalDitemukan: '2026-10-16', waktuDitemukan: '10:00',
        lokasiDitemukan: 'Parkiran Motor',
        namaPenyerah: 'Satpam Parkir',
        lokasiPenyimpanan: 'Brankas Pos Utama · Laci 1',
        highValue: true,
        status: ITEM_STATUS.DISERAHKAN,
        matchedReportId: 'LAP-005',
        dicatatOleh: 'Pak Joko', dicatatPada: '2026-10-16T10:15:00'
      },
      {
        id: 'ITM-007',
        jenis: 'Kunci', warna: 'Silver', merek: 'Honda',
        deskripsiUmum: 'Kunci motor dengan gantungan boneka kecil warna cokelat.',
        detailRahasia: '',
        tanggalDitemukan: '2026-10-20', waktuDitemukan: '17:10',
        lokasiDitemukan: 'Lapangan',
        namaPenyerah: 'Mahasiswa UKM Futsal',
        lokasiPenyimpanan: 'Rak A · Kotak Kecil 1',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Dedi', dicatatPada: '2026-10-20T17:25:00'
      },
      {
        id: 'ITM-008',
        jenis: 'Jaket', warna: 'Hijau', merek: 'Uniqlo',
        deskripsiUmum: 'Jaket parasut hijau army ukuran L, resleting bagian bawah macet.',
        detailRahasia: 'Di saku kiri ada struk fotokopi tertanggal 14 Oktober.',
        tanggalDitemukan: '2026-10-15', waktuDitemukan: '18:00',
        lokasiDitemukan: 'Masjid Kampus',
        namaPenyerah: 'Marbot Masjid',
        lokasiPenyimpanan: 'Rak C · Gantungan 4',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Bu Sri', dicatatPada: '2026-10-15T18:20:00'
      },
      {
        id: 'ITM-009',
        jenis: 'Payung', warna: 'Merah', merek: 'Tidak diketahui',
        deskripsiUmum: 'Payung lipat merah polos, pegangan karet hitam.',
        detailRahasia: '',
        tanggalDitemukan: '2026-10-19', waktuDitemukan: '07:50',
        lokasiDitemukan: 'Gedung B',
        namaPenyerah: 'Cleaning Service',
        lokasiPenyimpanan: 'Rak C · Keranjang 1',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Joko', dicatatPada: '2026-10-19T08:05:00'
      },
      {
        id: 'ITM-010',
        jenis: 'Tumbler', warna: 'Pink', merek: 'Lock&Lock',
        deskripsiUmum: 'Tumbler plastik pink dengan sedotan, tutup agak longgar.',
        detailRahasia: '',
        tanggalDitemukan: '2026-10-20', waktuDitemukan: '11:00',
        lokasiDitemukan: 'Kantin',
        namaPenyerah: 'Bu Yati',
        lokasiPenyimpanan: 'Rak B · Baris 2',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Rahmat', dicatatPada: '2026-10-20T11:15:00'
      },
      {
        id: 'ITM-011',
        jenis: 'Laptop', warna: 'Abu-abu', merek: 'ASUS',
        deskripsiUmum: 'Laptop 14 inci di dalam sleeve abu-abu, tertinggal di meja diskusi.',
        detailRahasia: 'Stiker Linux di penutup, nama akun login "afiq".',
        tanggalDitemukan: '2026-10-21', waktuDitemukan: '08:30',
        lokasiDitemukan: 'Perpustakaan',
        namaPenyerah: 'Petugas Perpustakaan',
        lokasiPenyimpanan: 'Brankas Pos Utama · Rak Atas',
        highValue: true,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Pak Dedi', dicatatPada: '2026-10-21T08:45:00'
      },
      {
        id: 'ITM-012',
        jenis: 'Kacamata', warna: 'Cokelat', merek: 'Tidak diketahui',
        deskripsiUmum: 'Kacamata bingkai cokelat dalam kotak hitam.',
        detailRahasia: '',
        tanggalDitemukan: '2026-10-18', waktuDitemukan: '14:15',
        lokasiDitemukan: 'Gedung C',
        namaPenyerah: 'Dosen Pengampu',
        lokasiPenyimpanan: 'Rak A · Kotak Kecil 2',
        highValue: false,
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: 'Bu Sri', dicatatPada: '2026-10-18T14:30:00'
      }
    ],

    /* ---- Laporan kehilangan dari mahasiswa (R1) ---- */
    reports: [
      {
        id: 'LAP-001',
        pelapor: 'Nabil Alviro G.', nim: '2024010045', kontak: '0812-xxxx-1045',
        jenis: 'Dompet', warna: 'Hitam', merek: 'Eiger',
        ciriKhusus: 'Ada kartu member Alfamart di dalamnya, sudut dompet lecet.',
        areaPerkiraan: 'Gedung A',
        tanggalHilang: '2026-10-19',
        waktuDari: '15:00', waktuSampai: '18:00',
        status: STATUS.DILAPORKAN,
        matchedItemId: null,
        dibuatPada: '2026-10-20T07:40:00',
        riwayat: [
          { waktu: '2026-10-20T07:40:00', teks: 'Laporan dibuat oleh mahasiswa.', oleh: 'Nabil Alviro G.' }
        ]
      },
      {
        id: 'LAP-002',
        pelapor: 'Nabil Alviro G.', nim: '2024010045', kontak: '0812-xxxx-1045',
        jenis: 'Tumbler', warna: 'Biru', merek: 'Corkcicle',
        ciriKhusus: 'Ada stiker band di badan tumbler.',
        areaPerkiraan: 'Perpustakaan',
        tanggalHilang: '2026-10-18',
        waktuDari: '11:00', waktuSampai: '13:00',
        status: STATUS.DILAPORKAN,
        matchedItemId: null,
        dibuatPada: '2026-10-18T19:10:00',
        riwayat: [
          { waktu: '2026-10-18T19:10:00', teks: 'Laporan dibuat oleh mahasiswa.', oleh: 'Nabil Alviro G.' }
        ]
      },
      {
        id: 'LAP-003',
        pelapor: 'Anisa Mufida T.', nim: '2024010078', kontak: '0857-xxxx-2078',
        jenis: 'Jaket', warna: 'Hijau', merek: 'Uniqlo',
        ciriKhusus: 'Ukuran L, resleting bawah macet.',
        areaPerkiraan: 'Masjid Kampus',
        tanggalHilang: '2026-10-15',
        waktuDari: '16:00', waktuSampai: '19:00',
        status: STATUS.DILAPORKAN,
        matchedItemId: null,
        dibuatPada: '2026-10-16T08:00:00',
        riwayat: [
          { waktu: '2026-10-16T08:00:00', teks: 'Laporan dibuat oleh mahasiswa.', oleh: 'Anisa Mufida T.' }
        ]
      },
      {
        id: 'LAP-004',
        pelapor: 'Nabil Alviro G.', nim: '2024010045', kontak: '0812-xxxx-1045',
        jenis: 'Handphone', warna: 'Hitam', merek: 'Samsung',
        ciriKhusus: 'Casing bening, ada retak halus di pojok kanan bawah.',
        areaPerkiraan: 'Aula',
        tanggalHilang: '2026-10-20',
        waktuDari: '12:00', waktuSampai: '14:00',
        status: STATUS.TUNGGU,
        matchedItemId: 'ITM-005',
        dibuatPada: '2026-10-20T14:25:00',
        riwayat: [
          { waktu: '2026-10-20T14:25:00', teks: 'Laporan dibuat oleh mahasiswa.', oleh: 'Nabil Alviro G.' },
          { waktu: '2026-10-20T15:05:00', teks: 'Staff menandai ITM-005 sebagai kemungkinan cocok.', oleh: 'Pak Rahmat' },
          { waktu: '2026-10-20T15:06:00', teks: 'Barang high-value — menunggu pemeriksaan bukti kepemilikan di pos.', oleh: 'Sistem' }
        ]
      },
      {
        id: 'LAP-005',
        pelapor: 'Arsalla J. S.', nim: '2024010112', kontak: '0898-xxxx-3112',
        jenis: 'KTM', warna: 'Putih', merek: 'Universitas Cakrawala',
        ciriKhusus: 'Atas nama Arsalla, sudut kartu tertekuk.',
        areaPerkiraan: 'Parkiran Motor',
        tanggalHilang: '2026-10-16',
        waktuDari: '08:00', waktuSampai: '11:00',
        status: STATUS.SELESAI,
        matchedItemId: 'ITM-006',
        dibuatPada: '2026-10-16T11:30:00',
        riwayat: [
          { waktu: '2026-10-16T11:30:00', teks: 'Laporan dibuat oleh mahasiswa.', oleh: 'Arsalla J. S.' },
          { waktu: '2026-10-16T12:10:00', teks: 'Staff menandai ITM-006 sebagai kemungkinan cocok.', oleh: 'Pak Joko' },
          { waktu: '2026-10-16T13:00:00', teks: 'Verifikasi bukti kepemilikan: VALID (KTP / SIM).', oleh: 'Pak Joko' },
          { waktu: '2026-10-16T13:02:00', teks: 'Status menjadi Siap Diambil.', oleh: 'Pak Joko' },
          { waktu: '2026-10-16T15:40:00', teks: 'Barang diserahkan kepada pemilik.', oleh: 'Pak Joko' }
        ]
      }
    ],

    /* ---- Catatan verifikasi klaim (R8, US-05, US-08) ---- */
    verifications: [
      {
        id: 'VRF-001',
        reportId: 'LAP-005', itemId: 'ITM-006',
        detailCocok: true, lokasiCocok: true,
        catatan: 'Mahasiswa menyebut nama dan NIM sesuai kartu, serta lokasi jatuh di parkiran motor.',
        highValue: true,
        jenisBukti: 'KTP / SIM',
        hasilBukti: 'valid',
        petugas: 'Pak Joko',
        waktu: '2026-10-16T13:00:00'
      }
    ],

    /* ---- Notifikasi ke mahasiswa (R6, AC2.2, AC2.3) ---- */
    notifications: [
      {
        id: 'NTF-001',
        reportId: 'LAP-004',
        untuk: 'Nabil Alviro G.',
        judul: 'Barang mirip laporan Anda ditemukan',
        pesan: 'Laporan LAP-004 (Handphone) memiliki kemungkinan kecocokan. Barang tergolong high-value — silakan datang ke Pos Security membawa bukti kepemilikan.',
        waktu: '2026-10-20T15:06:00',
        dibaca: false
      },
      {
        id: 'NTF-002',
        reportId: 'LAP-005',
        untuk: 'Arsalla J. S.',
        judul: 'Barang Anda sudah diserahkan',
        pesan: 'Laporan LAP-005 (KTM) telah selesai. Barang diserahkan di Pos Security.',
        waktu: '2026-10-16T15:40:00',
        dibaca: true
      }
    ],

    counters: { report: 5, item: 12, verif: 1, notif: 2 }
  };
}
