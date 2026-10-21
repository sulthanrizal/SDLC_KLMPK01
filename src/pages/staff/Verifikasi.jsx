/* ============================================================
   Verifikasi.jsx — checklist kepemilikan & serah terima
   Memenuhi: R8 · R9 · US5 · US-08 (change injection P11)
             AC5.1 · AC5.2 · AC5.3 · C1 · C2
   ============================================================ */

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import {
  Card, PageHead, Field, Callout, StatusBadge, HighValueBadge,
  EmptyState, Riwayat, fmtDate, fmtDateTime
} from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { STATUS, JENIS_BUKTI, PETUGAS } from '../../data/seed.js';

export default function Verifikasi() {
  const { id } = useParams();
  const s = useStore();
  const navigate = useNavigate();

  const report = s.reports.find((r) => r.id === id);
  const item = report ? s.items.find((i) => i.id === report.matchedItemId) : null;

  const [form, setForm] = useState({
    detailCocok: null,
    lokasiCocok: null,
    catatan: '',
    jenisBukti: '',
    hasilBukti: null,
    petugas: PETUGAS[0]
  });
  const [errors, setErrors] = useState({});

  if (!report) {
    return (
      <Card>
        <EmptyState icon="alert" title="Laporan tidak ditemukan">
          <Link to="/staff/laporan">Kembali ke daftar laporan</Link>
        </EmptyState>
      </Card>
    );
  }

  const riwayatVerif = s.verifications.filter((v) => v.reportId === report.id);
  const hv = item ? item.highValue : false;
  const bisaVerifikasi = report.status === STATUS.COCOK || report.status === STATUS.TUNGGU;
  const siapDiserahkan = report.status === STATUS.SIAP; // AC5.2

  function validate() {
    const err = {};
    if (form.detailCocok === null) err.detailCocok = 'Pilih hasil pengecekan detail spesifik.';
    if (form.lokasiCocok === null) err.lokasiCocok = 'Pilih hasil pengecekan lokasi hilang.';
    if (hv) {
      if (!form.jenisBukti) err.jenisBukti = 'Pilih jenis bukti yang diperiksa.';
      if (form.hasilBukti === null) err.hasilBukti = 'Catat hasil pemeriksaan bukti.';
    }
    return err;
  }

  function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      s.pushToast({ tone: 'danger', title: 'Verifikasi belum lengkap', message: 'Lengkapi checklist terlebih dahulu.' });
      return;
    }

    const lolos = s.saveVerification(report.id, form);
    s.pushToast({
      tone: lolos ? 'ok' : 'danger',
      title: lolos ? 'Verifikasi lolos' : 'Klaim ditolak',
      message: lolos
        ? 'Status laporan menjadi "Siap Diambil". Barang kini boleh diserahkan.'
        : 'Barang tetap disimpan dan tidak dapat diserahkan.'
    });
  }

  function onHandover() {
    const ok = s.markHandover(report.id);
    if (ok) {
      s.pushToast({ tone: 'ok', title: 'Barang diserahkan', message: `Laporan ${report.id} selesai.` });
    } else {
      /* AC5.2 — penjaga di store menolak perubahan bila verifikasi belum lolos */
      s.pushToast({
        tone: 'danger',
        title: 'Penyerahan ditolak',
        message: 'Checklist verifikasi belum lolos, barang tidak dapat ditandai diserahkan.'
      });
    }
  }

  return (
    <>
      <PageHead
        title={`Verifikasi Klaim · ${report.id}`}
        desc={`Pengklaim: ${report.pelapor} (${report.nim})`}
        trace={{ req: ['R8', 'R9'], story: ['US5', 'US-08'], ac: ['AC5.1', 'AC5.2', 'AC5.3'] }}
        actions={
          <button type="button" className="btn" onClick={() => navigate(`/staff/laporan/${report.id}`)}>
            <Icon name="back" size={15} />
            Kembali
          </button>
        }
      />

      <div className="grid grid-2">
        <div className="stack">
          <Card title="Barang yang diklaim" actions={hv ? <HighValueBadge /> : null}>
            {item ? (
              <>
                <dl className="dl">
                  <dt>ID barang</dt><dd className="mono">{item.id}</dd>
                  <dt>Jenis</dt><dd>{item.jenis}</dd>
                  <dt>Deskripsi umum</dt><dd>{item.deskripsiUmum || '—'}</dd>
                  <dt>Ditemukan</dt>
                  <dd>{item.lokasiDitemukan} · {fmtDate(item.tanggalDitemukan)} {item.waktuDitemukan}</dd>
                  <dt>Lokasi penyimpanan</dt><dd>{item.lokasiPenyimpanan}</dd>
                </dl>
                <div style={{ marginTop: 14 }}>
                  <Callout tone="warn" icon="lock" title="Detail rahasia (acuan pencocokan).">
                    {item.detailRahasia || 'Tidak ada detail rahasia yang dicatat untuk barang ini.'}
                  </Callout>
                </div>
              </>
            ) : (
              <EmptyState icon="box" title="Belum ada barang yang dicocokkan">
                Cocokkan laporan ini dengan sebuah barang temuan terlebih dahulu.
              </EmptyState>
            )}
          </Card>

          <Card title="Klaim dari pelapor">
            <dl className="dl">
              <dt>Ciri khusus disebut</dt><dd>{report.ciriKhusus || '—'}</dd>
              <dt>Lokasi hilang (klaim)</dt><dd>{report.areaPerkiraan || 'Tidak yakin'}</dd>
              <dt>Perkiraan tanggal</dt><dd>{fmtDate(report.tanggalHilang)}</dd>
            </dl>
          </Card>
        </div>

        <div className="stack">
          <Card title="Status" actions={<StatusBadge status={report.status} />}>
            <Callout tone="danger" icon="shield" title="Aturan wajib.">
              Barang tidak boleh diserahkan hanya karena seseorang mengaku sebagai pemilik.
              <span className="mono"> (C1)</span>
            </Callout>

            {/* ---------- Form checklist (AC5.1) ---------- */}
            {bisaVerifikasi && item && (
              <form onSubmit={onSubmit} noValidate style={{ marginTop: 16 }}>
                <div className="stack">
                  <Field label="Detail spesifik cocok dengan barang?" required error={errors.detailCocok}>
                    <div className="choice">
                      {[['Ya, cocok', true], ['Tidak cocok', false]].map(([label, val]) => (
                        <label key={label}>
                          <input
                            type="radio"
                            name="detailCocok"
                            checked={form.detailCocok === val}
                            onChange={() => {
                              setForm((f) => ({ ...f, detailCocok: val }));
                              setErrors((e) => ({ ...e, detailCocok: undefined }));
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field label="Lokasi hilang cocok dengan lokasi ditemukan?" required error={errors.lokasiCocok}>
                    <div className="choice">
                      {[['Ya, cocok', true], ['Tidak cocok', false]].map(([label, val]) => (
                        <label key={label}>
                          <input
                            type="radio"
                            name="lokasiCocok"
                            checked={form.lokasiCocok === val}
                            onChange={() => {
                              setForm((f) => ({ ...f, lokasiCocok: val }));
                              setErrors((e) => ({ ...e, lokasiCocok: undefined }));
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  {/* ---------- Langkah tambahan high-value (AC5.3 / US-08) ---------- */}
                  {hv && (
                    <fieldset>
                      <legend>Pemeriksaan bukti kepemilikan — barang high-value</legend>
                      <div className="stack">
                        <Callout tone="warn" icon="lock">
                          Bukti diperiksa <strong>langsung di pos</strong> oleh petugas. Mahasiswa tidak
                          mengunggah apa pun; sistem hanya mencatat hasilnya.
                          <span className="mono"> (kartu P11 · US-08)</span>
                        </Callout>

                        <Field label="Jenis bukti yang diperiksa" required error={errors.jenisBukti} htmlFor="bukti">
                          <select
                            id="bukti"
                            value={form.jenisBukti}
                            onChange={(e) => {
                              setForm((f) => ({ ...f, jenisBukti: e.target.value }));
                              setErrors((x) => ({ ...x, jenisBukti: undefined }));
                            }}
                          >
                            <option value="">— Pilih jenis bukti —</option>
                            {JENIS_BUKTI.map((b) => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </Field>

                        <Field label="Hasil pemeriksaan bukti" required error={errors.hasilBukti}>
                          <div className="choice">
                            {[['Valid', 'valid'], ['Tidak valid', 'tidak']].map(([label, val]) => (
                              <label key={val}>
                                <input
                                  type="radio"
                                  name="hasilBukti"
                                  checked={form.hasilBukti === val}
                                  onChange={() => {
                                    setForm((f) => ({ ...f, hasilBukti: val }));
                                    setErrors((e) => ({ ...e, hasilBukti: undefined }));
                                  }}
                                />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </Field>
                      </div>
                    </fieldset>
                  )}

                  <Field label="Catatan petugas" htmlFor="catatan">
                    <textarea
                      id="catatan"
                      value={form.catatan}
                      onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
                      placeholder="Catatan hasil pencocokan, pertanyaan yang diajukan, atau alasan penolakan."
                    />
                  </Field>

                  <Field label="Petugas pemeriksa" htmlFor="pt">
                    <select
                      id="pt"
                      value={form.petugas}
                      onChange={(e) => setForm((f) => ({ ...f, petugas: e.target.value }))}
                    >
                      {PETUGAS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Simpan hasil verifikasi</button>
                  </div>

                  {/* AC5.2 — tombol serah terima terkunci sebelum checklist lolos */}
                  <Callout tone="" icon="lock">
                    Tombol <strong>Tandai diserahkan</strong> masih terkunci. Barang baru bisa
                    diserahkan setelah checklist di atas lolos. <span className="mono">(AC5.2)</span>
                  </Callout>
                </div>
              </form>
            )}

            {/* ---------- Serah terima ---------- */}
            {siapDiserahkan && (
              <div className="stack" style={{ marginTop: 16 }}>
                <Callout tone="ok" icon="check" title="Verifikasi sudah lolos.">
                  Barang boleh diserahkan kepada pemilik. Ambil barang di{' '}
                  <strong>{item ? item.lokasiPenyimpanan : '—'}</strong>.
                </Callout>
                <div className="form-actions">
                  <button type="button" className="btn btn-primary" onClick={onHandover}>
                    <Icon name="check" size={15} />
                    Tandai diserahkan
                  </button>
                </div>
              </div>
            )}

            {report.status === STATUS.SELESAI && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="ok" icon="check" title="Laporan selesai.">
                  Barang sudah diserahkan kepada pemilik.
                </Callout>
              </div>
            )}

            {report.status === STATUS.DITOLAK && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="danger" icon="alert" title="Klaim ditolak.">
                  Checklist tidak lolos, barang tetap disimpan dan kecocokan dilepas. Laporan dapat
                  dicocokkan ulang dari halaman detail laporan.
                </Callout>
              </div>
            )}

            {report.status === STATUS.DILAPORKAN && (
              <div style={{ marginTop: 16 }}>
                <Callout tone="" icon="info" title="Belum ada kandidat yang dikonfirmasi.">
                  <Link to={`/staff/laporan/${report.id}`}>Buka detail laporan</Link> untuk memilih
                  barang temuan yang cocok terlebih dahulu.
                </Callout>
              </div>
            )}
          </Card>

          {riwayatVerif.length > 0 && (
            <Card title="Riwayat verifikasi">
              <div className="stack" style={{ gap: 16 }}>
                {riwayatVerif.map((v) => (
                  <div key={v.id}>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="mono">{v.id}</span>
                      <span className={`badge ${v.detailCocok && v.lokasiCocok && (!v.highValue || v.hasilBukti === 'valid') ? 'badge-ok' : 'badge-danger'}`}>
                        {v.detailCocok && v.lokasiCocok && (!v.highValue || v.hasilBukti === 'valid') ? 'Lolos' : 'Tidak lolos'}
                      </span>
                    </div>
                    <dl className="dl" style={{ marginTop: 8 }}>
                      <dt>Detail spesifik</dt><dd>{v.detailCocok ? 'Cocok' : 'Tidak cocok'}</dd>
                      <dt>Lokasi hilang</dt><dd>{v.lokasiCocok ? 'Cocok' : 'Tidak cocok'}</dd>
                      {v.highValue && (
                        <>
                          <dt>Jenis bukti</dt><dd>{v.jenisBukti || '—'}</dd>
                          <dt>Hasil bukti</dt><dd>{v.hasilBukti === 'valid' ? 'Valid' : 'Tidak valid'}</dd>
                        </>
                      )}
                      <dt>Catatan</dt><dd>{v.catatan || '—'}</dd>
                      <dt>Petugas</dt><dd>{v.petugas} · {fmtDateTime(v.waktu)}</dd>
                    </dl>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Riwayat laporan">
            <Riwayat items={report.riwayat} />
          </Card>
        </div>
      </div>
    </>
  );
}
