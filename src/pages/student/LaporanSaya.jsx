/* ============================================================
   LaporanSaya.jsx — daftar laporan milik mahasiswa
   Memenuhi: R5 · R6 · US2 · AC2.1
   ============================================================ */

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Card, PageHead, StatusBadge, EmptyState, fmtDate, fmtRentang } from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';

export default function LaporanSaya() {
  const s = useStore();

  return (
    <>
      <PageHead
        title="Laporan Saya"
        desc="Pantau status laporan tanpa perlu datang ke pos security."
        trace={{ req: ['R5', 'R6'], story: ['US2'], ac: ['AC2.1'] }}
        actions={
          <Link className="btn btn-primary" to="/lapor">
            <Icon name="plus" size={15} />
            Lapor baru
          </Link>
        }
      />

      <Card tight>
        {s.myReports.length === 0 ? (
          <EmptyState icon="file" title="Belum ada laporan">
            Laporan kehilangan yang Anda buat akan muncul di sini.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Barang</th>
                  <th>Perkiraan lokasi &amp; waktu</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {s.myReports.map((r) => (
                  <tr key={r.id}>
                    <td className="mono">{r.id}</td>
                    <td>
                      <strong>{r.jenis}</strong>
                      <div className="sub">{[r.warna, r.merek].filter(Boolean).join(' · ') || '—'}</div>
                    </td>
                    <td>
                      {r.areaPerkiraan || 'Area tidak pasti'}
                      <div className="sub">
                        {fmtDate(r.tanggalHilang)} · {fmtRentang(r.waktuDari, r.waktuSampai)}
                      </div>
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="actions">
                      <Link className="btn btn-sm" to={`/laporan-saya/${r.id}`}>Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
