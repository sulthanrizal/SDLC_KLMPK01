/* ============================================================
   BarangTemuan.jsx — daftar barang temuan versi mahasiswa
   Memenuhi: R7 · US6 · AC6.1 · AC6.2 · C4 · NFR1

   PENTING (AC6.1): tampilan ini HANYA boleh menampilkan
   jenis barang, area ditemukan, dan tanggal ditemukan.
   Warna, merek, deskripsi, penyerah, lokasi penyimpanan, dan
   detail rahasia TIDAK boleh ikut dirender di sini.
   ============================================================ */

import { useMemo, useState } from 'react';
import { Card, PageHead, Callout, EmptyState, Field, fmtDate } from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { AREAS, JENIS_BARANG, ITEM_STATUS } from '../../data/seed.js';

export default function BarangTemuan() {
  const s = useStore();
  const [jenis, setJenis] = useState('');
  const [area, setArea] = useState('');

  const rows = useMemo(() => {
    return s.items
      .filter((i) => i.status !== ITEM_STATUS.DISERAHKAN)
      .filter((i) => (jenis ? i.jenis === jenis : true))
      .filter((i) => (area ? i.lokasiDitemukan === area : true))
      .sort((a, b) => (a.tanggalDitemukan < b.tanggalDitemukan ? 1 : -1));
  }, [s.items, jenis, area]);

  return (
    <>
      <PageHead
        title="Barang Temuan"
        desc="Barang yang sudah diserahkan ke Pos Security. Merasa salah satunya milik Anda? Buat laporan kehilangan agar petugas bisa mencocokkan."
        trace={{ req: ['R7'], story: ['US6'], ac: ['AC6.1', 'AC6.2'] }}
      />

      <div className="stack">
        <Callout tone="warn" icon="lock" title="Informasi sengaja dibatasi.">
          Daftar ini hanya memuat jenis barang, area, dan tanggal ditemukan. Ciri detail dan isi
          barang tidak dipublikasikan supaya tidak dipakai untuk klaim palsu.
          <span className="mono"> (C4 · NFR1 · AC6.1)</span>
        </Callout>

        <Card title="Filter">
          <div className="filters">
            <Field label="Jenis barang" htmlFor="f-jenis">
              <select id="f-jenis" value={jenis} onChange={(e) => setJenis(e.target.value)}>
                <option value="">Semua jenis</option>
                {JENIS_BARANG.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </Field>
            <Field label="Area ditemukan" htmlFor="f-area">
              <select id="f-area" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Semua area</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </Field>
            <div className="field">
              <label>&nbsp;</label>
              <button
                type="button"
                className="btn"
                onClick={() => { setJenis(''); setArea(''); }}
              >
                Reset filter
              </button>
            </div>
          </div>
        </Card>

        <Card title={`Hasil (${rows.length} barang)`} tight>
          {rows.length === 0 ? (
            <EmptyState icon="box" title="Tidak ada barang yang cocok dengan filter">
              Coba longgarkan filter jenis atau area.
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Jenis barang</th>
                    <th>Area ditemukan</th>
                    <th>Tanggal ditemukan</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id}>
                      <td><strong>{i.jenis}</strong></td>
                      <td>{i.lokasiDitemukan}</td>
                      <td className="num">{fmtDate(i.tanggalDitemukan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
