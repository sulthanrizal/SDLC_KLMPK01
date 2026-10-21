/* ============================================================
   DaftarLaporan.jsx — laporan kehilangan yang masuk
   Memenuhi: R4 · US4 (pintu masuk pencocokan)
   ============================================================ */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, PageHead, Field, StatusBadge, HighValueBadge, EmptyState, fmtDate, fmtRentang
} from '../../components/ui.jsx';
import { useStore, findCandidates } from '../../store/StoreContext.jsx';
import { STATUS } from '../../data/seed.js';

const FILTERS = ['Semua', ...Object.values(STATUS)];

export default function DaftarLaporan() {
  const s = useStore();
  const [status, setStatus] = useState('Semua');

  const rows = useMemo(
    () => s.reports.filter((r) => (status === 'Semua' ? true : r.status === status)),
    [s.reports, status]
  );

  return (
    <>
      <PageHead
        title="Laporan Kehilangan"
        desc="Laporan dari mahasiswa beserta jumlah kandidat barang temuan yang berpotensi cocok."
        trace={{ req: ['R4'], story: ['US4'], ac: ['AC4.2'] }}
      />

      <div className="stack">
        <Card title="Filter status">
          <div className="filters">
            <Field label="Status laporan" htmlFor="st">
              <select id="st" value={status} onChange={(e) => setStatus(e.target.value)}>
                {FILTERS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
          </div>
        </Card>

        <Card title={`${rows.length} laporan`} tight>
          {rows.length === 0 ? (
            <EmptyState icon="file" title="Tidak ada laporan dengan status ini" />
          ) : (
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Barang</th>
                    <th>Pelapor</th>
                    <th>Perkiraan hilang</th>
                    <th>Kandidat</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const cands = findCandidates(r, s.items);
                    const matched = s.items.find((i) => i.id === r.matchedItemId);
                    return (
                      <tr key={r.id}>
                        <td className="mono">{r.id}</td>
                        <td>
                          <div className="row" style={{ gap: 6 }}>
                            <strong>{r.jenis}</strong>
                            {matched && matched.highValue && <HighValueBadge />}
                          </div>
                          <div className="sub">
                            {[r.warna, r.merek].filter(Boolean).join(' · ') || '—'}
                          </div>
                        </td>
                        <td>
                          {r.pelapor}
                          <div className="sub">{r.nim}</div>
                        </td>
                        <td>
                          {r.areaPerkiraan || 'Tidak yakin'}
                          <div className="sub">
                            {fmtDate(r.tanggalHilang)} · {fmtRentang(r.waktuDari, r.waktuSampai)}
                          </div>
                        </td>
                        <td className="num">
                          {r.status === STATUS.DILAPORKAN ? (
                            cands.length > 0 ? (
                              <span className="badge badge-info">{cands.length} kandidat</span>
                            ) : (
                              <span className="dim small">—</span>
                            )
                          ) : (
                            <span className="mono small">{r.matchedItemId || '—'}</span>
                          )}
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                        <td className="actions">
                          <Link className="btn btn-sm" to={`/staff/laporan/${r.id}`}>Buka</Link>
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
    </>
  );
}
