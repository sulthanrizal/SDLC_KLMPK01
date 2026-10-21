/* ============================================================
   DetailLaporan.jsx — status & riwayat satu laporan (sisi mahasiswa)
   Memenuhi: R5 · R6 · US2 · AC2.1 · AC2.3 · NFR1
   ============================================================ */

import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import {
  Card, PageHead, StatusBadge, StatusTimeline, Riwayat, Callout,
  EmptyState, fmtDate, fmtDateTime, fmtRentang
} from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { STATUS } from '../../data/seed.js';

export default function DetailLaporan() {
  const { id } = useParams();
  const s = useStore();
  const navigate = useNavigate();

  const report = s.reports.find((r) => r.id === id);
  if (!report) {
    return (
      <Card>
        <EmptyState icon="alert" title="Laporan tidak ditemukan">
          <Link to="/laporan-saya">Kembali ke daftar laporan</Link>
        </EmptyState>
      </Card>
    );
  }

  const item = s.items.find((i) => i.id === report.matchedItemId);
  const highValue = item ? item.highValue : false;
  const notifs = s.notifications.filter((n) => n.reportId === report.id);

  return (
    <>
      <PageHead
        title={`${report.jenis} · ${report.id}`}
        desc={`Dilaporkan pada ${fmtDateTime(report.dibuatPada)}`}
        trace={{ req: ['R5', 'R6'], story: ['US2'], ac: ['AC2.1', 'AC2.3'] }}
        actions={
          <button type="button" className="btn" onClick={() => navigate('/laporan-saya')}>
            <Icon name="back" size={15} />
            Kembali
          </button>
        }
      />

      <div className="grid grid-2">
        <div className="stack">
          <Card title="Status laporan" actions={<StatusBadge status={report.status} />}>
            <StatusTimeline report={report} highValue={highValue} />

            {report.status === STATUS.TUNGGU && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="warn" icon="lock" title="Bawa bukti kepemilikan ke pos.">
                  Barang ini tergolong high-value. Petugas akan memeriksa bukti kepemilikan Anda
                  langsung di Pos Security sebelum barang dapat diserahkan. Anda tidak perlu
                  mengunggah apa pun lewat aplikasi.
                </Callout>
              </div>
            )}

            {report.status === STATUS.SIAP && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="ok" icon="check" title="Barang siap diambil.">
                  Silakan datang ke Pos Security Gerbang Utama pada jam layanan dengan membawa KTM.
                </Callout>
              </div>
            )}

            {report.status === STATUS.DITOLAK && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="danger" icon="alert" title="Klaim belum dapat disetujui.">
                  Hasil verifikasi belum memenuhi syarat, sehingga barang tetap disimpan petugas.
                  Hubungi Pos Security untuk informasi lanjutan.
                </Callout>
              </div>
            )}
          </Card>

          <Card title="Rincian laporan Anda">
            <dl className="dl">
              <dt>Jenis</dt><dd>{report.jenis}</dd>
              <dt>Warna</dt><dd>{report.warna || '—'}</dd>
              <dt>Merek</dt><dd>{report.merek || '—'}</dd>
              <dt>Ciri khusus</dt><dd>{report.ciriKhusus || '—'}</dd>
              <dt>Perkiraan area</dt><dd>{report.areaPerkiraan || 'Tidak yakin'}</dd>
              <dt>Perkiraan waktu</dt>
              <dd>{fmtDate(report.tanggalHilang)} · {fmtRentang(report.waktuDari, report.waktuSampai)}</dd>
            </dl>
          </Card>
        </div>

        <div className="stack">
          {/* AC2.3 — informasi barang yang cocok TIDAK memuat isi / detail rahasia */}
          {item && (
            <Card title="Barang yang mungkin cocok">
              <dl className="dl">
                <dt>Jenis</dt><dd>{item.jenis}</dd>
                <dt>Area ditemukan</dt><dd>{item.lokasiDitemukan}</dd>
                <dt>Tanggal ditemukan</dt><dd>{fmtDate(item.tanggalDitemukan)}</dd>
              </dl>
              <div style={{ marginTop: 14 }}>
                <Callout tone="warn" icon="lock">
                  Isi dan ciri rahasia barang sengaja tidak ditampilkan. Petugas akan mencocokkannya
                  langsung dengan Anda di pos. <span className="mono">(AC2.3 · NFR1 · C4)</span>
                </Callout>
              </div>
            </Card>
          )}

          <Card title="Riwayat">
            <Riwayat items={report.riwayat} />
          </Card>

          {notifs.length > 0 && (
            <Card title="Pemberitahuan terkait laporan ini">
              <div className="stack" style={{ gap: 12 }}>
                {notifs.map((n) => (
                  <div key={n.id}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{n.judul}</div>
                    <p className="small muted">{n.pesan}</p>
                    <p className="small dim">{fmtDateTime(n.waktu)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
