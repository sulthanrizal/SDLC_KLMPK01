/* ============================================================
   CatatTemuan.jsx — input barang temuan oleh staff
   Memenuhi: R2 · R9 · US3 · AC3.1 · AC3.2 · AC3.3 · C2 · C3
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHead, Field, Callout, HighValueBadge } from '../../components/ui.jsx';
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

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const hv = isHighValue(form.jenis); // AC3.3 — penandaan otomatis

  function validate() {
    const err = {};
    if (!form.jenis) err.jenis = 'Jenis barang wajib dipilih.';
    if (!form.tanggalDitemukan) err.tanggalDitemukan = 'Tanggal ditemukan wajib diisi.';
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
    const err = validate();
    setErrors(err);

    if (Object.keys(err).length > 0) {
      s.pushToast({
        tone: 'danger',
        title: 'Record tidak tersimpan',
        message: 'Lengkapi field wajib yang ditandai.'
      });
      return;
    }

    const created = s.addItem(form);
    s.pushToast({
      tone: 'ok',
      title: `Record ${created.id} tersimpan`,
      message: created.highValue
        ? 'Barang ditandai high-value dan disimpan terpisah.'
        : 'Barang tercatat di record pos security.'
    });
    navigate('/staff/record');
  }

  return (
    <>
      <PageHead
        title="Catat Barang Temuan"
        desc="Dicatat saat barang diserahkan ke pos. Lokasi penyimpanan wajib diisi agar barang mudah ditemukan kembali."
        trace={{ req: ['R2', 'R9'], story: ['US3'], ac: ['AC3.1', 'AC3.2', 'AC3.3'] }}
      />

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
                <Callout tone="warn" icon="lock" title="Barang ini otomatis ditandai high-value.">
                  HP, laptop, dompet, dan KTM wajib disimpan terpisah dan butuh pemeriksaan bukti
                  kepemilikan saat diklaim. <span className="mono">(C2 · C3 · AC3.3 · US-08)</span>
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
              onClick={() => { setForm(KOSONG); setErrors({}); }}
            >
              Kosongkan form
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
