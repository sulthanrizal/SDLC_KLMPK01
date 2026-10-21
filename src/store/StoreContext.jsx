/* ============================================================
   StoreContext.jsx — state aplikasi + aturan bisnis
   Lost & Found Campus · Group G1

   Semua aturan yang berasal dari Acceptance Criteria P10 dan
   change injection P11 dikumpulkan di sini supaya mudah ditelusuri.
   ============================================================ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seed, STATUS, ITEM_STATUS, HIGH_VALUE_JENIS, USERS } from '../data/seed.js';

const KEY_DATA = 'lf-campus:data:v1';
const KEY_ROLE = 'lf-campus:role:v1';
const KEY_THEME = 'lf-campus:theme:v1';

/* ---------- localStorage aman (bisa diblokir di private window) ---------- */

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* diabaikan — aplikasi tetap jalan tanpa penyimpanan */
  }
}

/* ---------- Helper ---------- */

const pad = (n) => String(n).padStart(3, '0');
const nowISO = () => new Date().toISOString().slice(0, 19);

export const isHighValue = (jenis) => HIGH_VALUE_JENIS.includes(jenis);

/**
 * AC4.2 — kandidat kecocokan untuk sebuah laporan: barang temuan dengan
 * jenis yang sama dan tanggal ditemukan pada atau setelah perkiraan
 * tanggal kehilangan. Barang yang sudah diserahkan tidak ikut.
 */
export function findCandidates(report, items) {
  if (!report) return [];
  return items.filter(
    (it) =>
      it.jenis === report.jenis &&
      it.status === ITEM_STATUS.DISIMPAN &&
      it.tanggalDitemukan >= report.tanggalHilang
  );
}

/* ---------- Context ---------- */

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => load(KEY_DATA, null) || seed());
  const [role, setRoleState] = useState(() => load(KEY_ROLE, 'mahasiswa'));
  const [theme, setThemeState] = useState(() => load(KEY_THEME, 'auto'));
  const [toasts, setToasts] = useState([]);

  useEffect(() => save(KEY_DATA, data), [data]);
  useEffect(() => save(KEY_ROLE, role), [role]);

  useEffect(() => {
    save(KEY_THEME, theme);
    const el = document.documentElement;
    if (theme === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', theme);
  }, [theme]);

  /* ---------- Toast ---------- */

  const pushToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, tone: 'info', ...toast }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---------- Aksi: laporan kehilangan (R1) ---------- */

  const addReport = useCallback((form) => {
    let created = null;
    setData((prev) => {
      const n = prev.counters.report + 1;
      const id = `LAP-${pad(n)}`;
      created = {
        id,
        pelapor: USERS.mahasiswa.nama,
        nim: USERS.mahasiswa.nim,
        kontak: form.kontak || '-',
        jenis: form.jenis,
        warna: form.warna || '',
        merek: form.merek || '',
        ciriKhusus: form.ciriKhusus || '',
        areaPerkiraan: form.areaPerkiraan || '',
        tanggalHilang: form.tanggalHilang || '',
        waktuDari: form.waktuDari || '',
        waktuSampai: form.waktuSampai || '',
        status: STATUS.DILAPORKAN, // AC1.1
        matchedItemId: null,
        dibuatPada: nowISO(),
        riwayat: [
          { waktu: nowISO(), teks: 'Laporan dibuat oleh mahasiswa.', oleh: USERS.mahasiswa.nama }
        ]
      };
      return {
        ...prev,
        reports: [created, ...prev.reports],
        counters: { ...prev.counters, report: n }
      };
    });
    return created;
  }, []);

  /* ---------- Aksi: catat barang temuan (R2, R9) ---------- */

  const addItem = useCallback((form) => {
    let created = null;
    setData((prev) => {
      const n = prev.counters.item + 1;
      const id = `ITM-${pad(n)}`;
      created = {
        id,
        jenis: form.jenis,
        warna: form.warna || '',
        merek: form.merek || '',
        deskripsiUmum: form.deskripsiUmum || '',
        detailRahasia: form.detailRahasia || '',
        tanggalDitemukan: form.tanggalDitemukan,
        waktuDitemukan: form.waktuDitemukan || '',
        lokasiDitemukan: form.lokasiDitemukan,
        namaPenyerah: form.namaPenyerah,
        lokasiPenyimpanan: form.lokasiPenyimpanan,
        highValue: isHighValue(form.jenis), // AC3.3 — penandaan otomatis
        status: ITEM_STATUS.DISIMPAN,
        matchedReportId: null,
        dicatatOleh: form.dicatatOleh || USERS.staff.nama,
        dicatatPada: nowISO()
      };
      return {
        ...prev,
        items: [created, ...prev.items],
        counters: { ...prev.counters, item: n }
      };
    });
    return created;
  }, []);

  /* ---------- Aksi: konfirmasi kecocokan (R4, AC4.3) ---------- */

  const confirmMatch = useCallback((reportId, itemId) => {
    setData((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      const report = prev.reports.find((r) => r.id === reportId);
      if (!item || !report) return prev;

      const hv = item.highValue;
      const waktu = nowISO();
      const nextReportStatus = hv ? STATUS.TUNGGU : STATUS.COCOK;

      const notifId = `NTF-${pad(prev.counters.notif + 1)}`;
      /* AC2.3 — notifikasi tidak memuat isi barang / detail rahasia */
      const notif = {
        id: notifId,
        reportId,
        untuk: report.pelapor,
        judul: 'Barang mirip laporan Anda ditemukan',
        pesan: hv
          ? `Laporan ${reportId} (${report.jenis}) memiliki kemungkinan kecocokan. Barang tergolong high-value — silakan datang ke Pos Security membawa bukti kepemilikan.`
          : `Laporan ${reportId} (${report.jenis}) memiliki kemungkinan kecocokan. Silakan datang ke Pos Security untuk verifikasi.`,
        waktu,
        dibaca: false
      };

      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                status: hv ? ITEM_STATUS.TUNGGU : ITEM_STATUS.DICOCOKKAN,
                matchedReportId: reportId
              }
            : i
        ),
        reports: prev.reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: nextReportStatus,
                matchedItemId: itemId,
                riwayat: [
                  ...r.riwayat,
                  { waktu, teks: `Staff menandai ${itemId} sebagai kemungkinan cocok.`, oleh: USERS.staff.nama },
                  ...(hv
                    ? [{ waktu, teks: 'Barang high-value — menunggu pemeriksaan bukti kepemilikan di pos.', oleh: 'Sistem' }]
                    : [])
                ]
              }
            : r
        ),
        notifications: [notif, ...prev.notifications],
        counters: { ...prev.counters, notif: prev.counters.notif + 1 }
      };
    });
  }, []);

  /* ---------- Aksi: batalkan kecocokan ---------- */

  const unlinkMatch = useCallback((reportId) => {
    setData((prev) => {
      const report = prev.reports.find((r) => r.id === reportId);
      if (!report || !report.matchedItemId) return prev;
      const waktu = nowISO();
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === report.matchedItemId
            ? { ...i, status: ITEM_STATUS.DISIMPAN, matchedReportId: null }
            : i
        ),
        reports: prev.reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: STATUS.DILAPORKAN,
                matchedItemId: null,
                riwayat: [
                  ...r.riwayat,
                  { waktu, teks: `Kecocokan dengan ${report.matchedItemId} dibatalkan oleh staff.`, oleh: USERS.staff.nama }
                ]
              }
            : r
        )
      };
    });
  }, []);

  /* ---------- Aksi: simpan verifikasi klaim (R8, US-05, US-08) ---------- */

  const saveVerification = useCallback((reportId, form) => {
    let lolos = false;
    setData((prev) => {
      const report = prev.reports.find((r) => r.id === reportId);
      if (!report || !report.matchedItemId) return prev;
      const item = prev.items.find((i) => i.id === report.matchedItemId);
      if (!item) return prev;

      const hv = item.highValue;
      /* AC5.2 + AC5.3 — checklist wajib lolos; high-value butuh bukti valid */
      lolos = form.detailCocok === true && form.lokasiCocok === true && (!hv || form.hasilBukti === 'valid');

      const waktu = nowISO();
      const vId = `VRF-${pad(prev.counters.verif + 1)}`;
      const verification = {
        id: vId,
        reportId,
        itemId: item.id,
        detailCocok: form.detailCocok,
        lokasiCocok: form.lokasiCocok,
        catatan: form.catatan || '',
        highValue: hv,
        jenisBukti: hv ? form.jenisBukti : '',
        hasilBukti: hv ? form.hasilBukti : '',
        petugas: form.petugas,
        waktu
      };

      const notifId = `NTF-${pad(prev.counters.notif + 1)}`;
      const notif = {
        id: notifId,
        reportId,
        untuk: report.pelapor,
        judul: lolos ? 'Barang Anda siap diambil' : 'Klaim belum dapat disetujui',
        pesan: lolos
          ? `Verifikasi laporan ${reportId} berhasil. Barang dapat diambil di Pos Security pada jam operasional.`
          : `Verifikasi laporan ${reportId} belum memenuhi syarat. Silakan hubungi Pos Security untuk informasi lanjutan.`,
        waktu,
        dibaca: false
      };

      const riwayatBaru = [
        {
          waktu,
          teks: hv
            ? `Verifikasi bukti kepemilikan: ${form.hasilBukti === 'valid' ? 'VALID' : 'TIDAK VALID'}${form.jenisBukti ? ` (${form.jenisBukti})` : ''}.`
            : `Verifikasi klaim: detail ${form.detailCocok ? 'cocok' : 'tidak cocok'}, lokasi ${form.lokasiCocok ? 'cocok' : 'tidak cocok'}.`,
          oleh: form.petugas
        },
        {
          waktu,
          teks: lolos ? 'Status menjadi Siap Diambil.' : 'Klaim ditolak — barang tetap disimpan.',
          oleh: form.petugas
        }
      ];

      return {
        ...prev,
        verifications: [verification, ...prev.verifications],
        items: prev.items.map((i) =>
          i.id === item.id
            ? lolos
              ? { ...i, status: ITEM_STATUS.DICOCOKKAN }
              : { ...i, status: ITEM_STATUS.DISIMPAN, matchedReportId: null }
            : i
        ),
        reports: prev.reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: lolos ? STATUS.SIAP : STATUS.DITOLAK,
                matchedItemId: lolos ? r.matchedItemId : null,
                riwayat: [...r.riwayat, ...riwayatBaru]
              }
            : r
        ),
        notifications: [notif, ...prev.notifications],
        counters: {
          ...prev.counters,
          verif: prev.counters.verif + 1,
          notif: prev.counters.notif + 1
        }
      };
    });
    return lolos;
  }, []);

  /* ---------- Aksi: serah terima (AC5.2) ---------- */

  const markHandover = useCallback((reportId) => {
    let ok = false;
    setData((prev) => {
      const report = prev.reports.find((r) => r.id === reportId);
      /* Barang tidak bisa ditandai "diserahkan" sebelum checklist lolos */
      if (!report || report.status !== STATUS.SIAP) return prev;
      ok = true;

      const waktu = nowISO();
      const notifId = `NTF-${pad(prev.counters.notif + 1)}`;

      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === report.matchedItemId ? { ...i, status: ITEM_STATUS.DISERAHKAN } : i
        ),
        reports: prev.reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: STATUS.SELESAI,
                riwayat: [
                  ...r.riwayat,
                  { waktu, teks: 'Barang diserahkan kepada pemilik.', oleh: USERS.staff.nama }
                ]
              }
            : r
        ),
        notifications: [
          {
            id: notifId,
            reportId,
            untuk: report.pelapor,
            judul: 'Barang Anda sudah diserahkan',
            pesan: `Laporan ${reportId} (${report.jenis}) telah selesai. Terima kasih.`,
            waktu,
            dibaca: false
          },
          ...prev.notifications
        ],
        counters: { ...prev.counters, notif: prev.counters.notif + 1 }
      };
    });
    return ok;
  }, []);

  /* ---------- Notifikasi ---------- */

  const markNotifRead = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, dibaca: true } : n))
    }));
  }, []);

  const markAllNotifRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, dibaca: true }))
    }));
  }, []);

  /* ---------- Reset ---------- */

  const resetData = useCallback(() => {
    setData(seed());
  }, []);

  const setRole = useCallback((r) => setRoleState(r), []);
  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : t === 'light' ? 'auto' : 'dark'));
  }, []);

  /* ---------- Turunan ---------- */

  const value = useMemo(() => {
    const me = USERS.mahasiswa.nama;
    const myReports = data.reports.filter((r) => r.pelapor === me);
    const myNotifs = data.notifications.filter((n) => n.untuk === me);

    return {
      ...data,
      role,
      setRole,
      theme,
      toggleTheme,
      user: role === 'staff' ? USERS.staff : USERS.mahasiswa,
      me,
      myReports,
      myNotifs,
      unreadCount: myNotifs.filter((n) => !n.dibaca).length,
      toasts,
      pushToast,
      dismissToast,
      addReport,
      addItem,
      confirmMatch,
      unlinkMatch,
      saveVerification,
      markHandover,
      markNotifRead,
      markAllNotifRead,
      resetData
    };
  }, [
    data, role, setRole, theme, toggleTheme, toasts, pushToast, dismissToast,
    addReport, addItem, confirmMatch, unlinkMatch, saveVerification,
    markHandover, markNotifRead, markAllNotifRead, resetData
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore harus dipakai di dalam <StoreProvider>');
  return ctx;
}
