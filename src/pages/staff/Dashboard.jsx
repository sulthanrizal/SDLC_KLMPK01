/* ============================================================
   Dashboard.jsx — ringkasan operasional pos security
   ============================================================ */

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Card, PageHead, StatusBadge, HighValueBadge, EmptyState, fmtDate } from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { STATUS, ITEM_STATUS } from '../../data/seed.js';

export default function Dashboard() {
  const s = useStore();

  const disimpan = s.items.filter((i) => i.status === ITEM_STATUS.DISIMPAN);
  const highValue = s.items.filter((i) => i.highValue && i.status !== ITEM_STATUS.DISERAHKAN);
  const belumDicocokkan = s.reports.filter((r) => r.status === STATUS.DILAPORKAN);
  const perluVerifikasi = s.reports.filter(
    (r) => r.status === STATUS.COCOK || r.status === STATUS.TUNGGU
  );
  const siapDiambil = s.reports.filter((r) => r.status === STATUS.SIAP);

  return (
    <>
      <PageHead
        title="Dashboard Pos Security"
        desc="Ringkasan barang temuan dan laporan kehilangan yang perlu ditindaklanjuti."
        actions={
          <Link className="btn btn-primary" to="/staff/catat">
            <Icon name="plus" size={15} />
            Catat barang temuan
          </Link>
        }
      />

      <div className="stack">
        <div className="grid grid-4">
          <div className="stat">
            <span className="label">Barang disimpan</span>
            <span className="value">{disimpan.length}</span>
            <span className="hint">Belum dicocokkan dengan laporan</span>
          </div>
          <div className="stat">
            <span className="label">High-value</span>
            <span className="value">{highValue.length}</span>
            <span className="hint">Disimpan terpisah (C3)</span>
          </div>
          <div className="stat">
            <span className="label">Laporan baru</span>
            <span className="value">{belumDicocokkan.length}</span>
            <span className="hint">Menunggu pencocokan staff</span>
          </div>
          <div className="stat">
            <span className="label">Perlu verifikasi</span>
            <span className="value">{perluVerifikasi.length}</span>
            <span className="hint">Sebelum barang diserahkan</span>
          </div>
        </div>

        <div className="grid grid-2">
          <Card
            title="Laporan menunggu pencocokan"
            tight
            actions={<Link className="btn btn-sm" to="/staff/laporan">Lihat semua</Link>}
          >
            {belumDicocokkan.length === 0 ? (
              <EmptyState icon="check" title="Semua laporan sudah ditindaklanjuti" />
            ) : (
              <div className="table-wrap">
                <table className="tbl">
                  <tbody>
                    {belumDicocokkan.slice(0, 5).map((r) => (
                      <tr key={r.id}>
                        <td className="mono">{r.id}</td>
                        <td>
                          <strong>{r.jenis}</strong>
                          <div className="sub">{r.pelapor}</div>
                        </td>
                        <td className="num">{fmtDate(r.tanggalHilang)}</td>
                        <td className="actions">
                          <Link className="btn btn-sm" to={`/staff/laporan/${r.id}`}>Cocokkan</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card
            title="Menunggu verifikasi klaim"
            tight
            actions={<Link className="btn btn-sm" to="/staff/laporan">Lihat semua</Link>}
          >
            {perluVerifikasi.length === 0 ? (
              <EmptyState icon="check" title="Tidak ada klaim yang menunggu" />
            ) : (
              <div className="table-wrap">
                <table className="tbl">
                  <tbody>
                    {perluVerifikasi.map((r) => {
                      const item = s.items.find((i) => i.id === r.matchedItemId);
                      return (
                        <tr key={r.id}>
                          <td className="mono">{r.id}</td>
                          <td>
                            <strong>{r.jenis}</strong>
                            <div className="sub">{item ? item.id : '—'}</div>
                          </td>
                          <td>
                            <div className="row" style={{ gap: 6 }}>
                              <StatusBadge status={r.status} />
                              {item && item.highValue && <HighValueBadge />}
                            </div>
                          </td>
                          <td className="actions">
                            <Link className="btn btn-sm btn-primary" to={`/staff/verifikasi/${r.id}`}>
                              Verifikasi
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {siapDiambil.length > 0 && (
          <Card title="Siap diambil pemilik" tight>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Laporan</th>
                    <th>Barang</th>
                    <th>Pemilik</th>
                    <th>Lokasi penyimpanan</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {siapDiambil.map((r) => {
                    const item = s.items.find((i) => i.id === r.matchedItemId);
                    return (
                      <tr key={r.id}>
                        <td className="mono">{r.id}</td>
                        <td>{r.jenis}</td>
                        <td>{r.pelapor}</td>
                        <td className="small">{item ? item.lokasiPenyimpanan : '—'}</td>
                        <td className="actions">
                          <Link className="btn btn-sm" to={`/staff/verifikasi/${r.id}`}>Serah terima</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
