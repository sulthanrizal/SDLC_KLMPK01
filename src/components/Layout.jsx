/* ============================================================
   Layout.jsx — sidebar, topbar, panel notifikasi, toast
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { ToastStack, fmtDateTime } from './ui.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { STATUS } from '../data/seed.js';

const NAV = {
  mahasiswa: [
    { to: '/beranda', label: 'Beranda', icon: 'home' },
    { to: '/lapor', label: 'Lapor Kehilangan', icon: 'plus' },
    { to: '/laporan-saya', label: 'Laporan Saya', icon: 'file' },
    { to: '/barang-temuan', label: 'Barang Temuan', icon: 'box' }
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', icon: 'home', end: true },
    { to: '/staff/catat', label: 'Catat Barang Temuan', icon: 'plus' },
    { to: '/staff/record', label: 'Record Barang Temuan', icon: 'box' },
    { to: '/staff/laporan', label: 'Laporan Kehilangan', icon: 'file' }
  ]
};

const TITLES = [
  [/^\/beranda/, 'Beranda', 'Informasi kanal resmi lost & found'],
  [/^\/lapor$/, 'Lapor Kehilangan', 'Buat laporan barang hilang'],
  [/^\/laporan-saya\/.+/, 'Detail Laporan', 'Status dan riwayat laporan Anda'],
  [/^\/laporan-saya/, 'Laporan Saya', 'Daftar laporan kehilangan Anda'],
  [/^\/barang-temuan/, 'Barang Temuan', 'Daftar barang yang ditemukan di kampus'],
  [/^\/staff\/catat/, 'Catat Barang Temuan', 'Input barang temuan yang diserahkan ke pos'],
  [/^\/staff\/record/, 'Record Barang Temuan', 'Cari dan filter record barang temuan'],
  [/^\/staff\/verifikasi\/.+/, 'Verifikasi Klaim', 'Checklist kepemilikan sebelum penyerahan'],
  [/^\/staff\/laporan\/.+/, 'Detail Laporan', 'Kandidat kecocokan dan tindakan staff'],
  [/^\/staff\/laporan/, 'Laporan Kehilangan', 'Laporan masuk dari mahasiswa'],
  [/^\/staff/, 'Dashboard Staff', 'Ringkasan operasional pos security'],
  [/^\/traceability/, 'Traceability Matrix', 'Hubungan evidence P9 → layar aplikasi']
];

function pageMeta(path) {
  for (const [re, title, sub] of TITLES) if (re.test(path)) return { title, sub };
  return { title: 'Lost & Found Campus', sub: 'Prototype frontend · data dummy' };
}

export default function Layout() {
  const s = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const meta = pageMeta(location.pathname);
  const links = NAV[s.role];

  /* Tutup menu mobile setiap pindah halaman */
  useEffect(() => setMenuOpen(false), [location.pathname]);

  /* Klik di luar menutup panel notifikasi */
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [notifOpen]);

  const switchRole = (role) => {
    s.setRole(role);
    navigate(role === 'staff' ? '/staff' : '/beranda');
  };

  const pendingReports = s.reports.filter((r) => r.status === STATUS.DILAPORKAN).length;
  const needVerif = s.reports.filter(
    (r) => r.status === STATUS.COCOK || r.status === STATUS.TUNGGU
  ).length;

  return (
    <div className="layout">
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">LF</div>
          <div className="brand-text">
            <strong>Lost &amp; Found</strong>
            <span>Campus · Group G1</span>
          </div>
        </div>

        <div className="role-switch" role="group" aria-label="Pilih peran pengguna">
          <button
            type="button"
            className="role-btn"
            aria-pressed={s.role === 'mahasiswa'}
            onClick={() => switchRole('mahasiswa')}
          >
            Mahasiswa
          </button>
          <button
            type="button"
            className="role-btn"
            aria-pressed={s.role === 'staff'}
            onClick={() => switchRole('staff')}
          >
            Staff Security
          </button>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          <div className="nav-group">{s.role === 'staff' ? 'Operasional Pos' : 'Menu Mahasiswa'}</div>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              <Icon name={l.icon} />
              <span>{l.label}</span>
              {l.to === '/staff/laporan' && pendingReports > 0 && (
                <span className="pill" title="Laporan belum dicocokkan">{pendingReports}</span>
              )}
              {l.to === '/staff/record' && needVerif > 0 && (
                <span className="pill pill-quiet" title="Menunggu verifikasi">{needVerif}</span>
              )}
              {l.to === '/laporan-saya' && s.unreadCount > 0 && (
                <span className="pill">{s.unreadCount}</span>
              )}
            </NavLink>
          ))}

          <div className="nav-group">Dokumentasi</div>
          <NavLink to="/traceability">
            <Icon name="link" />
            <span>Traceability</span>
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <button type="button" className="btn btn-ghost btn-sm" onClick={s.toggleTheme}>
            <Icon name={s.theme === 'dark' ? 'sun' : 'moon'} size={15} />
            <span>Tema: {s.theme === 'auto' ? 'Otomatis' : s.theme === 'dark' ? 'Gelap' : 'Terang'}</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (window.confirm('Kembalikan semua data ke kondisi awal (data dummy)?')) {
                s.resetData();
                s.pushToast({ tone: 'ok', title: 'Data direset', message: 'Seluruh data kembali ke seed awal.' });
              }
            }}
          >
            <Icon name="refresh" size={15} />
            <span>Reset data</span>
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <button
            type="button"
            className="btn btn-ghost btn-icon mobile-only"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu"
          >
            <Icon name="menu" />
          </button>

          <div className="topbar-title">
            <h1>{meta.title}</h1>
            <p>{meta.sub}</p>
          </div>

          <div className="topbar-actions">
            {s.role === 'mahasiswa' && (
              <div className="notif" ref={notifRef}>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  aria-label="Notifikasi"
                  aria-expanded={notifOpen}
                  onClick={() => setNotifOpen((v) => !v)}
                >
                  <Icon name="bell" />
                  {s.unreadCount > 0 && <span className="notif-dot" />}
                </button>

                {notifOpen && (
                  <div className="notif-panel">
                    <header>
                      <span>Notifikasi</span>
                      <div style={{ flex: 1 }} />
                      {s.unreadCount > 0 && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={s.markAllNotifRead}>
                          Tandai dibaca
                        </button>
                      )}
                    </header>
                    {s.myNotifs.length === 0 && (
                      <div className="notif-item"><span className="m">Belum ada notifikasi.</span></div>
                    )}
                    {s.myNotifs.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item${n.dibaca ? '' : ' unread'}`}
                        onClick={() => {
                          s.markNotifRead(n.id);
                          setNotifOpen(false);
                          navigate(`/laporan-saya/${n.reportId}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="t">{n.judul}</div>
                        <div className="m">{n.pesan}</div>
                        <div className="d">{fmtDateTime(n.waktu)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="who">
              <span className="avatar">{s.user.inisial}</span>
              <span className="who-name">{s.user.nama}</span>
            </div>
          </div>
        </header>

        <main className="main">
          <Outlet />
        </main>

        <footer className="foot">
          Prototype frontend · Lost &amp; Found Campus · SDLC Universitas Cakrawala · Seluruh isi
          aplikasi ini adalah <strong>data dummy</strong>, bukan data stakeholder sebenarnya.
        </footer>
      </div>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <ToastStack toasts={s.toasts} onDismiss={s.dismissToast} />
    </div>
  );
}
