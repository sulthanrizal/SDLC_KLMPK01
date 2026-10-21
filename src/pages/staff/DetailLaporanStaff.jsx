/* ============================================================
   DetailLaporanStaff.jsx — pencocokan laporan dengan barang temuan
   Memenuhi: R4 · US4 · AC4.2 · AC4.3
   ============================================================ */

import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import {
  Card, PageHead, StatusBadge, HighValueBadge, Callout, EmptyState,
  Riwayat, fmtDate, fmtDateTime, fmtRentang
} from '../../components/ui.jsx';
import { useStore, findCandidates } from '../../store/StoreContext.jsx';
import { STATUS } from '../../data/seed.js';

export default function DetailLaporanStaff() {
  const { id } = useParams();
  const s = useStore();
  const navigate = useNavigate();

  const report = s.reports.find((r) => r.id === id);
  if (!report) {
    return (
      <Card>
        <EmptyState icon="alert" title="Laporan tidak ditemukan">
          <Link to="/staff/laporan">Kembali ke daftar laporan</Link>
        </EmptyState>
      </Card>
    );
  }

  const candidates = findCandidates(report, s.items);
  const matched = s.items.find((i) => i.id === report.matchedItemId);
  const belumDicocokkan = report.status === STATUS.DILAPORKAN || report.status === STATUS.DITOLAK;

  function onConfirm(itemId, highValue) {
    s.confirmMatch(report.id, itemId);
    s.pushToast({
      tone: 'ok',
      title: `Kecocokan ${itemId} dikonfirmasi`,
      message: highValue
        ? 'Status menjadi "Menunggu Verifikasi Bukti" dan pelapor diberi tahu untuk membawa bukti.'
        : 'Pelapor menerima pemberitahuan untuk datang ke pos.'
    });
  }

  return (
    <>
      <PageHead
        title={`${report.jenis} · ${report.id}`}
        desc={`Dilaporkan oleh ${report.pelapor} (${report.nim}) pada ${fmtDateTime(report.dibuatPada)}`}
        trace={{ req: ['R4'], story: ['US4'], ac: ['AC4.2', 'AC4.3'] }}
        actions={
          <button type="button" className="btn" onClick={() => navigate('/staff/laporan')}>
            <Icon name="back" size={15} />
            Kembali
          </button>
        }
      />

      <div className="grid grid-2">
        <div className="stack">
          <Card title="Isi laporan" actions={<StatusBadge status={report.status} />}>
            <dl className="dl">
              <dt>Jenis</dt><dd>{report.jenis}</dd>
              <dt>Warna / merek</dt>
              <dd>{[report.warna, report.merek].filter(Boolean).join(' · ') || '—'}</dd>
              <dt>Ciri khusus</dt><dd>{report.ciriKhusus || '—'}</dd>
              <dt>Perkiraan area</dt><dd>{report.areaPerkiraan || 'Tidak yakin'}</dd>
              <dt>Perkiraan waktu</dt>
              <dd>{fmtDate(report.tanggalHilang)} · {fmtRentang(report.waktuDari, report.waktuSampai)}</dd>
              <dt>Kontak</dt><dd>{report.kontak}</dd>
            </dl>
          </Card>

          <Card title="Riwayat">
            <Riwayat items={report.riwayat} />
          </Card>
        </div>

        <div className="stack">
          {matched ? (
            <Card
              title="Barang yang sudah dicocokkan"
              actions={matched.highValue ? <HighValueBadge /> : null}
            >
              <dl className="dl">
                <dt>ID barang</dt><dd className="mono">{matched.id}</dd>
                <dt>Deskripsi</dt><dd>{matched.deskripsiUmum || '—'}</dd>
                <dt>Ditemukan</dt>
                <dd>{matched.lokasiDitemukan} · {fmtDate(matched.tanggalDitemukan)}</dd>
                <dt>Lokasi penyimpanan</dt><dd>{matched.lokasiPenyimpanan}</dd>
              </dl>

              <div style={{ marginTop: 14 }}>
                <Callout tone="warn" icon="lock" title="Detail rahasia (hanya staff).">
                  {matched.detailRahasia || 'Tidak ada detail rahasia yang dicatat.'}
                </Callout>
              </div>

              <div className="form-actions" style={{ marginTop: 16 }}>
                {(report.status === STATUS.COCOK || report.status === STATUS.TUNGGU) && (
                  <Link className="btn btn-primary" to={`/staff/verifikasi/${report.id}`}>
                    <Icon name="shield" size={15} />
                    Lanjut ke verifikasi klaim
                  </Link>
                )}
                {report.status === STATUS.SIAP && (
                  <Link className="btn btn-primary" to={`/staff/verifikasi/${report.id}`}>
                    <Icon name="check" size={15} />
                    Proses serah terima
                  </Link>
                )}
                {report.status !== STATUS.SELESAI && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      s.unlinkMatch(report.id);
                      s.pushToast({ tone: 'info', title: 'Kecocokan dibatalkan', message: 'Barang kembali berstatus Disimpan.' });
                    }}
                  >
                    Batalkan kecocokan
                  </button>
                )}
              </div>
            </Card>
          ) : (
            <Card
              title={`Kandidat kecocokan (${candidates.length})`}
              sub="Jenis barang sama dan ditemukan pada atau setelah perkiraan tanggal kehilangan."
            >
              {/* AC4.3 — status laporan tidak berubah sampai staff mengonfirmasi */}
              <Callout tone="info" title="Keputusan tetap di tangan staff.">
                Sistem hanya menyarankan. Status laporan tidak berubah sebelum Anda menekan
                "Konfirmasi cocok". <span className="mono">(R4 · AC4.3)</span>
              </Callout>

              <div style={{ marginTop: 14 }}>
                {candidates.length === 0 ? (
                  <EmptyState icon="search" title="Belum ada kandidat">
                    Belum ada barang temuan berjenis {report.jenis} yang ditemukan pada atau setelah{' '}
                    {fmtDate(report.tanggalHilang)}.
                  </EmptyState>
                ) : (
                  candidates.map((c) => (
                    <div className="cand" key={c.id}>
                      <div className="cand-main">
                        <div className="cand-title">
                          <span className="mono">{c.id}</span>
                          <span>{c.jenis}</span>
                          {c.highValue && <HighValueBadge />}
                        </div>
                        <div className="cand-meta">
                          {[c.warna, c.merek].filter(Boolean).join(' · ') || 'Warna/merek tidak dicatat'}
                        </div>
                        <div className="cand-meta">
                          Ditemukan di <strong>{c.lokasiDitemukan}</strong> ·{' '}
                          {fmtDate(c.tanggalDitemukan)} {c.waktuDitemukan}
                        </div>
                        <div className="cand-meta small">Disimpan di: {c.lokasiPenyimpanan}</div>
                        <div className="cand-why">
                          Alasan kandidat: jenis sama ({report.jenis}); ditemukan{' '}
                          {c.tanggalDitemukan === report.tanggalHilang
                            ? 'pada tanggal yang sama'
                            : 'setelah'}{' '}
                          perkiraan kehilangan
                          {report.areaPerkiraan && c.lokasiDitemukan === report.areaPerkiraan
                            ? '; area juga cocok'
                            : ''}
                          .
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onConfirm(c.id, c.highValue)}
                      >
                        Konfirmasi cocok
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {belumDicocokkan && candidates.length === 0 && (
            <Callout tone="" icon="info">
              Tips: barang yang baru masuk akan otomatis muncul sebagai kandidat di sini. Anda juga
              bisa mencari manual lewat menu <Link to="/staff/record">Record Barang Temuan</Link>.
            </Callout>
          )}
        </div>
      </div>
    </>
  );
}
