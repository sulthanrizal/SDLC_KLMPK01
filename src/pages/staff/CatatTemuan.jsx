/* ============================================================
   CatatTemuan.jsx — input barang temuan oleh staff
   Memenuhi: R2 · R9 · US3 · AC3.1 · AC3.2 · AC3.3 · C2 · C3
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHead, Field, Callout, HighValueBadge } from '../../components/ui.jsx';
import Icon from '../../components/Icon.jsx';
import { useStore, isHighValue } from '../../store/StoreContext.jsx';
import { AREAS, JENIS_BARANG, WARNA, PETUGAS } from '../../data/seed.js';

const KOSONG = {
  jenis: '',
  warna: '',
  merek: '',
  deskripsiUmum: '',
  detailRahasia: '',
  tanggalDitemukan: '',
  waktuDitemukan: '',
  lokasiDitemukan: '',
  namaPenyerah: '',
  lokasiPenyimpanan: '',
  dicatatOleh: PETUGAS[0]
};

export default function CatatTemuan() {
  const s = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(KOSONG);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [savedRecord, setSavedRecord] = useState(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
    if (savedRecord) setSavedRecord(null);
  };

  const hv = isHighValue(form.jenis); // AC3.3 — penandaan otomatis

  function validate() {
    const err = {};
    if (!form.jenis) err.jenis = 'Jenis barang wajib dipilih.';
    
    if (!form.tanggalDitemukan) {
      err.tanggalDitemukan = 'Tanggal ditemukan wajib diisi.';
    } else {
      const selectedDate = new Date(form.tanggalDitemukan);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        err.tanggalDitemukan = 'Tanggal ditemukan tidak boleh melebihi hari ini.';
      }
    }

    if (!form.lokasiDitemukan) err.lokasiDitemukan = 'Lokasi ditemukan wajib dipilih.';
    if (!form.namaPenyerah.trim()) err.namaPenyerah = 'Nama penyerah wajib diisi.';

    /* AC3.2 — tanpa lokasi penyimpanan, record tidak tersimpan.
       AC3.3 — untuk high-value, yang diisi harus lokasi penyimpanan terpisah. */
    if (!form.lokasiPenyimpanan.trim()) {
      err.lokasiPenyimpanan = hv
        ? 'Lokasi penyimpanan terpisah wajib diisi untuk barang high-value.'
        : 'Lokasi penyimpanan wajib diisi.';
    }
    return err;
  }

  function onSubmit(e) {
    e.preventDefault();
    setHasSubmitted(true);
    const err = validate();
    setErrors(err);

    if (Object.keys(err).length > 0) {
      setSavedRecord(null);
      s.pushToast({
        tone: 'danger',
        title: 'Record tidak tersimpan',
        message: 'Lengkapi field wajib yang ditandai.'
      });
      // Scroll perlahan ke atas agar banner error terbaca
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const created = s.addItem(form);
    setSavedRecord(created);
    setForm(KOSONG); // Reset form agar siap untuk input baru & cegah double submit
    setHasSubmitted(false);

    s.pushToast({
      tone: 'ok',
      title: `Record ${created.id} tersimpan`,
      message: created.highValue
        ? 'Barang ditandai high-value dan disimpan terpisah.'
        : 'Barang tercatat di record pos security.'
    });

    // Scroll ke atas agar banner konfirmasi sukses langsung terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <PageHead
        title="Catat Barang Temuan"
        desc="Dicatat saat barang diserahkan ke pos. Lokasi penyimpanan wajib diisi agar barang mudah ditemukan kembali."
        trace={{ req: ['R2', 'R9'], story: ['US3'], ac: ['AC3.1', 'AC3.2', 'AC3.3'] }}
      />

      <div className="stack" style={{ gap: 16 }}>
        {/* Banner Feedback Sukses Penyimpanan (AC3.1) */}
        {savedRecord && (
          <div
            className="card"
            style={{
              border: '2px solid var(--ok)',
              background: 'var(--ok-soft)',
              padding: '16px 18px',
              borderRadius: 'var(--radius)'
            }}
          >
            <div className="stack" style={{ gap: 14 }}>
              <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
                <Icon name="check" size={26} style={{ color: 'var(--ok)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <h3 style={{ color: 'var(--ok)', margin: 0, fontSize: 17, fontWeight: 700 }}>
                      Record Berhasil Disimpan: <span className="mono">{savedRecord.id}</span>
                    </h3>
                    {savedRecord.highValue && <HighValueBadge />}
                  </div>
                  <p className="small" style={{ marginTop: 4, color: 'var(--text-2)' }}>
                    {savedRecord.highValue
                      ? 'Barang bernilai tinggi (C2/C3). Pastikan barang fisik telah masuk ke brankas/loker khusus security.'
                      : 'Barang temuan telah resmi terdaftar dan siap dicocokkan dengan laporan mahasiswa.'}
                  </p>
                </div>
              </div>

              {/* Ringkasan Record Singkat */}
              <div
                style={{
                  background: 'var(--surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="dl" style={{ gridTemplateColumns: '150px 1fr', gap: '8px 14px' }}>
                  <dt>Jenis & Barang</dt>
                  <dd>
                    <strong>{savedRecord.jenis}</strong>
                    {savedRecord.merek ? ` (${savedRecord.merek})` : ''}
                    {savedRecord.warna ? ` · ${savedRecord.warna}` : ''}
                  </dd>
                  <dt>Lokasi Penyimpanan</dt>
                  <dd><strong className="mono" style={{ color: 'var(--brand)' }}>{savedRecord.lokasiPenyimpanan}</strong></dd>
                  <dt>Lokasi Ditemukan</dt>
                  <dd>{savedRecord.lokasiDitemukan} · {savedRecord.tanggalDitemukan} {savedRecord.waktuDitemukan ? `(${savedRecord.waktuDitemukan})` : ''}</dd>
                  <dt>Penyerah & Petugas</dt>
                  <dd>{savedRecord.namaPenyerah} (Dicatat oleh: {savedRecord.dicatatOleh})</dd>
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="form-actions" style={{ marginTop: 2 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/staff/record')}
                >
                  Lihat di Daftar Record
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setSavedRecord(null);
                    setForm(KOSONG);
                    setErrors({});
                  }}
                >
                  Catat Barang Lainnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner Feedback Validasi Error (AC3.1, AC3.2) */}
        {hasSubmitted && Object.keys(errors).length > 0 && (
          <Callout tone="danger" icon="alert" title="Pencatatan Gagal — Periksa Field Wajib">
            Harap lengkapi semua field yang ditandai merah sebelum menyimpan record, terutama lokasi penyimpanan fisik.
          </Callout>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="stack">
            <Card title="Identitas barang">
              <div className="stack">
                <div className="grid grid-3">
                  <Field label="Jenis barang" required error={errors.jenis} htmlFor="jenis">
                    <select id="jenis" value={form.jenis} onChange={set('jenis')}>
                      <option value="">— Pilih jenis —</option>
                      {JENIS_BARANG.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Warna" htmlFor="warna">
                    <select id="warna" value={form.warna} onChange={set('warna')}>
                      <option value="">— Tidak dicatat —</option>
                      {WARNA.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Merek" htmlFor="merek">
                    <input id="merek" type="text" value={form.merek} onChange={set('merek')} placeholder="mis. Eiger" />
                  </Field>
                </div>

                {hv && (
                  <Callout tone="warn" icon="lock" title="Protokol Pengamanan High-Value Aktif (AC3.3 / C2 / C3)">
                    Barang jenis <strong>{form.jenis}</strong> secara otomatis ditandai sebagai barang berharga tinggi.
                    Wajib disimpan terpisah di brankas/loker pos security dan memerlukan verifikasi bukti kepemilikan ketat saat klaim.
                  </Callout>
                )}

                <Field
                  label="Deskripsi umum"
                  htmlFor="desk"
                  help="Deskripsi yang aman bila suatu saat perlu disebut ke pelapor."
                >
                  <textarea
                    id="desk"
                    value={form.deskripsiUmum}
                    onChange={set('deskripsiUmum')}
                    placeholder="mis. Dompet lipat dua, bahan kulit sintetis, kondisi agak lecet di sudut."
                  />
                </Field>

                <Field
                  label="Detail rahasia (hanya staff)"
                  htmlFor="rahasia"
                  help="Isi barang atau ciri yang hanya diketahui pemilik. Tidak pernah ditampilkan ke mahasiswa (NFR1 · C4) dan dipakai sebagai kunci verifikasi."
                >
                  <textarea
                    id="rahasia"
                    value={form.detailRahasia}
                    onChange={set('detailRahasia')}
                    placeholder="mis. berisi kartu member Alfamart a.n. R. Aulia dan uang tunai Rp85.000"
                  />
                </Field>
              </div>
            </Card>

            <Card title="Waktu, lokasi & penyerah">
              <div className="stack">
                <div className="grid grid-3">
                  <Field label="Tanggal ditemukan" required error={errors.tanggalDitemukan} htmlFor="tgl">
                    <input id="tgl" type="date" value={form.tanggalDitemukan} onChange={set('tanggalDitemukan')} />
                  </Field>
                  <Field label="Jam ditemukan" htmlFor="jam">
                    <input id="jam" type="time" value={form.waktuDitemukan} onChange={set('waktuDitemukan')} />
                  </Field>
                  <Field label="Lokasi ditemukan" required error={errors.lokasiDitemukan} htmlFor="lok">
                    <select id="lok" value={form.lokasiDitemukan} onChange={set('lokasiDitemukan')}>
                      <option value="">— Pilih area —</option>
                      {AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-2">
                  <Field label="Nama penyerah" required error={errors.namaPenyerah} htmlFor="penyerah">
                    <input
                      id="penyerah"
                      type="text"
                      value={form.namaPenyerah}
                      onChange={set('namaPenyerah')}
                      placeholder="mis. Bu Yati (kantin) / Mahasiswa"
                    />
                  </Field>
                  <Field label="Dicatat oleh" htmlFor="petugas">
                    <select id="petugas" value={form.dicatatOleh} onChange={set('dicatatOleh')}>
                      {PETUGAS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </Card>

            <Card
              title="Lokasi penyimpanan fisik"
              actions={hv ? <HighValueBadge /> : null}
            >
              <Field
                label={hv ? 'Lokasi penyimpanan terpisah' : 'Lokasi penyimpanan'}
                required
                error={errors.lokasiPenyimpanan}
                htmlFor="simpan"
                help={
                  hv
                    ? 'Barang high-value disimpan terpisah dari barang biasa (C3). Contoh: "Brankas Pos Utama · Laci 1".'
                    : 'Contoh: "Rak B · Baris 2". Tanpa ini, record tidak dapat disimpan (AC3.2).'
                }
              >
                <input
                  id="simpan"
                  type="text"
                  value={form.lokasiPenyimpanan}
                  onChange={set('lokasiPenyimpanan')}
                  placeholder={hv ? 'Brankas Pos Utama · Laci 1' : 'Rak B · Baris 2'}
                />
              </Field>
            </Card>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Simpan record</button>
              <button
                type="button"
                className="btn"
                onClick={() => { setForm(KOSONG); setErrors({}); setSavedRecord(null); setHasSubmitted(false); }}
              >
                Kosongkan form
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
