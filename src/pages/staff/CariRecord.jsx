/* ============================================================
   CariRecord.jsx — pencarian record barang temuan (sisi staff)
   Memenuhi: R3 · US4 · AC4.1 · NFR1
   ============================================================ */

import { useMemo, useState } from 'react';
import {
  Card, PageHead, Field, StatusBadge, HighValueBadge, EmptyState,
  Modal, Callout, fmtDate, fmtDateTime
} from '../../components/ui.jsx';
import Icon from '../../components/Icon.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { AREAS, JENIS_BARANG, WARNA } from '../../data/seed.js';

export default function CariRecord() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [jenis, setJenis] = useState('');
  const [warna, setWarna] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [detail, setDetail] = useState(null);

  /* AC4.1 — hanya record yang sesuai kata kunci / filter yang ditampilkan,
     lengkap dengan lokasi penyimpanannya. */
  const rows = useMemo(() => {
    const key = q.trim().toLowerCase();
    return s.items
      .filter((i) => (jenis ? i.jenis === jenis : true))
      .filter((i) => (warna ? i.warna === warna : true))
      .filter((i) => (lokasi ? i.lokasiDitemukan === lokasi : true))
      .filter((i) => (tanggal ? i.tanggalDitemukan === tanggal : true))
      .filter((i) =>
        key
          ? [i.id, i.jenis, i.warna, i.merek, i.deskripsiUmum, i.lokasiDitemukan, i.lokasiPenyimpanan, i.namaPenyerah]
              .join(' ')
              .toLowerCase()
              .includes(key)
          : true
      )
      .sort((a, b) => (a.tanggalDitemukan < b.tanggalDitemukan ? 1 : -1));
  }, [s.items, q, jenis, warna, lokasi, tanggal]);

  const resetFilter = () => {
    setQ(''); setJenis(''); setWarna(''); setLokasi(''); setTanggal('');
  };

  return (
    <>
      <PageHead
        title="Record Barang Temuan"
        desc="Cari record tanpa harus membuka buku catatan satu per satu. Lokasi penyimpanan fisik ikut ditampilkan."
        trace={{ req: ['R3'], story: ['US4'], ac: ['AC4.1'] }}
      />

      <div className="stack">
        <Card title="Pencarian & filter">
          <div className="stack">
            <Field label="Kata kunci" htmlFor="q">
              <input
                id="q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari ID, jenis, merek, deskripsi, penyerah, atau lokasi penyimpanan…"
              />
            </Field>
            <div className="filters">
              <Field label="Jenis" htmlFor="f1">
                <select id="f1" value={jenis} onChange={(e) => setJenis(e.target.value)}>
                  <option value="">Semua</option>
                  {JENIS_BARANG.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </Field>
              <Field label="Warna" htmlFor="f2">
                <select id="f2" value={warna} onChange={(e) => setWarna(e.target.value)}>
                  <option value="">Semua</option>
                  {WARNA.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </Field>
              <Field label="Lokasi ditemukan" htmlFor="f3">
                <select id="f3" value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
                  <option value="">Semua</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Tanggal ditemukan" htmlFor="f4">
                <input id="f4" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </Field>
              <div className="field">
                <label>&nbsp;</label>
                <button type="button" className="btn" onClick={resetFilter}>Reset</button>
              </div>
            </div>
          </div>
        </Card>

        <Card title={`${rows.length} record ditemukan`} tight>
          {rows.length === 0 ? (
            <EmptyState icon="search" title="Tidak ada record yang cocok">
              Longgarkan kata kunci atau filter pencarian.
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Barang</th>
                    <th>Ditemukan</th>
                    <th>Lokasi penyimpanan</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id}>
                      <td className="mono">{i.id}</td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <strong>{i.jenis}</strong>
                          {i.highValue && <HighValueBadge />}
                        </div>
                        <div className="sub">{[i.warna, i.merek].filter(Boolean).join(' · ') || '—'}</div>
                      </td>
                      <td>
                        {i.lokasiDitemukan}
                        <div className="sub">{fmtDate(i.tanggalDitemukan)} {i.waktuDitemukan}</div>
                      </td>
                      <td className="small">{i.lokasiPenyimpanan}</td>
                      <td><StatusBadge status={i.status} kind="item" /></td>
                      <td className="actions">
                        <button type="button" className="btn btn-sm" onClick={() => setDetail(i)}>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {detail && (
        <Modal title={`${detail.jenis} · ${detail.id}`} onClose={() => setDetail(null)}>
          <div className="stack">
            <div className="row" style={{ gap: 6 }}>
              <StatusBadge status={detail.status} kind="item" />
              {detail.highValue && <HighValueBadge />}
            </div>

            <dl className="dl">
              <dt>Warna / merek</dt>
              <dd>{[detail.warna, detail.merek].filter(Boolean).join(' · ') || '—'}</dd>
              <dt>Deskripsi umum</dt><dd>{detail.deskripsiUmum || '—'}</dd>
              <dt>Ditemukan</dt>
              <dd>{detail.lokasiDitemukan} · {fmtDate(detail.tanggalDitemukan)} {detail.waktuDitemukan}</dd>
              <dt>Penyerah</dt><dd>{detail.namaPenyerah}</dd>
              <dt>Lokasi penyimpanan</dt><dd>{detail.lokasiPenyimpanan}</dd>
              <dt>Dicatat</dt><dd>{detail.dicatatOleh} · {fmtDateTime(detail.dicatatPada)}</dd>
              <dt>Laporan terkait</dt><dd className="mono">{detail.matchedReportId || '—'}</dd>
            </dl>

            {/* NFR1 — detail rahasia hanya terlihat oleh staff */}
            <Callout tone="warn" icon="lock" title="Detail rahasia (hanya staff).">
              {detail.detailRahasia || 'Tidak ada detail rahasia yang dicatat untuk barang ini.'}
            </Callout>
          </div>
        </Modal>
      )}
    </>
  );
}
