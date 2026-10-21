/* ============================================================
   Beranda.jsx — informasi kanal resmi lost & found
   Memenuhi: R10 · US7 · AC7.1 · AC7.2
   ============================================================ */

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Card, PageHead, Callout, StatusBadge } from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { STATUS } from '../../data/seed.js';

const LANGKAH_LAPOR = [
  'Buka menu "Lapor Kehilangan" dan isi jenis barang beserta ciri-cirinya.',
  'Lokasi dan waktu boleh diisi perkiraan saja — tidak harus tepat.',
  'Pantau status laporan di menu "Laporan Saya". Anda tidak perlu datang ke pos hanya untuk bertanya.',
  'Datang ke Pos Security hanya saat status sudah "Siap Diambil" atau diminta membawa bukti.'
];

const LANGKAH_TEMUAN = [
  'Serahkan barang temuan ke Pos Security di gerbang utama.',
  'Sebutkan di mana dan kira-kira jam berapa barang ditemukan.',
  'Petugas akan mencatat barang beserta lokasi penyimpanannya.',
  'Anda tidak perlu menyimpan atau mengumumkan barang sendiri.'
];

export default function Beranda() {
  const s = useStore();
  const aktif = s.myReports.filter(
    (r) => r.status !== STATUS.SELESAI && r.status !== STATUS.DITOLAK
  );

  return (
    <>
      <PageHead
        title={`Halo, ${s.user.nama.split(' ')[0]} 👋`}
        desc="Semua informasi resmi lost & found kampus ada di satu tempat. Tidak perlu bolak-balik ke pos security hanya untuk bertanya."
        trace={{ req: ['R10'], story: ['US7'], ac: ['AC7.1', 'AC7.2'] }}
        actions={
          <Link className="btn btn-primary" to="/lapor">
            <Icon name="plus" size={15} />
            Lapor Kehilangan
          </Link>
        }
      />

      <div className="stack">
        {aktif.length > 0 && (
          <Card title="Laporan Anda yang masih berjalan" tight>
            <div className="table-wrap">
              <table className="tbl">
                <tbody>
                  {aktif.map((r) => (
                    <tr key={r.id}>
                      <td className="mono">{r.id}</td>
                      <td>
                        <strong>{r.jenis}</strong>
                        <div className="sub">{[r.warna, r.merek].filter(Boolean).join(' · ') || '—'}</div>
                      </td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="actions">
                        <Link className="btn btn-sm" to={`/laporan-saya/${r.id}`}>Lihat</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div className="grid grid-2">
          {/* AC7.1 — cara melapor kehilangan */}
          <Card title="Cara melapor barang hilang">
            <ol className="stack" style={{ gap: 10, paddingLeft: 18, margin: 0 }}>
              {LANGKAH_LAPOR.map((t, i) => (
                <li key={i} className="small muted">{t}</li>
              ))}
            </ol>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-primary btn-sm" to="/lapor">Mulai lapor</Link>
            </div>
          </Card>

          {/* AC7.1 — cara menyerahkan barang temuan */}
          <Card title="Cara menyerahkan barang temuan">
            <ol className="stack" style={{ gap: 10, paddingLeft: 18, margin: 0 }}>
              {LANGKAH_TEMUAN.map((t, i) => (
                <li key={i} className="small muted">{t}</li>
              ))}
            </ol>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-sm" to="/barang-temuan">Lihat barang temuan</Link>
            </div>
          </Card>
        </div>

        {/* AC7.2 — lokasi pos security tercantum di halaman utama */}
        <Card title="Pos Security (kanal resmi)">
          <div className="grid grid-3">
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Icon name="pin" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Lokasi</div>
                <p className="small muted">
                  Pos Security Gerbang Utama, samping lobi Gedung A, Universitas Cakrawala.
                </p>
              </div>
            </div>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Icon name="clock" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Jam layanan</div>
                <p className="small muted">Senin–Jumat 07.00–18.00 · Sabtu 08.00–14.00</p>
              </div>
            </div>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Icon name="shield" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Pos cabang</div>
                <p className="small muted">Pos Parkiran Motor (barang temuan diteruskan ke pos utama).</p>
              </div>
            </div>
          </div>
        </Card>

        <Callout tone="warn" icon="lock" title="Kenapa detail barang tidak ditampilkan lengkap?">
          Daftar barang temuan hanya menampilkan jenis, area, dan tanggal. Isi dan ciri rahasia barang
          sengaja disembunyikan supaya tidak dipakai orang lain untuk mengaku-ngaku sebagai pemilik.
          (Constraint C4 · NFR1)
        </Callout>
      </div>
    </>
  );
}
