/* ============================================================
   LaporKehilangan.jsx — form laporan barang hilang
   Memenuhi: R1 · US1 · AC1.1 · AC1.2 · AC1.3 · C5
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHead, Field, Callout } from '../../components/ui.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { AREAS, JENIS_BARANG, WARNA, HIGH_VALUE_JENIS } from '../../data/seed.js';

const KOSONG = {
  jenis: '',
  warna: '',
  merek: '',
  ciriKhusus: '',
  areaPerkiraan: '',
  tanggalHilang: '',
  waktuDari: '',
  waktuSampai: '',
  kontak: ''
};

export default function LaporKehilangan() {
  const s = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(KOSONG);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined, ciri: undefined }));
  };

  function validate() {
    const err = {};

    /* AC1.3 — jenis barang wajib; tanpa itu laporan tidak tersimpan */
    if (!form.jenis) err.jenis = 'Jenis barang wajib dipilih.';

    /* AC1.1 — minimal satu ciri: warna, merek, atau ciri khusus */
    if (!form.warna && !form.merek.trim() && !form.ciriKhusus.trim()) {
      err.ciri = 'Isi minimal satu ciri barang: warna, merek, atau ciri khusus.';
    }

    if (!form.tanggalHilang) {
        err.tanggalHilang = 'Perkiraan tanggal kehilangan wajib diisi.';
      } else {
        const selectedDate = new Date(form.tanggalHilang);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) {
          err.tanggalHilang = 'Tanggal kehilangan tidak boleh melebihi hari ini.';
        }
      }

    /* AC1.2 — rentang waktu & area boleh perkiraan, jadi TIDAK divalidasi ketat.
       Yang dicek hanya konsistensi bila dua-duanya diisi. */
    if (form.waktuDari && form.waktuSampai && form.waktuDari > form.waktuSampai) {
      err.waktuSampai = 'Jam selesai harus setelah jam mulai.';
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
        title: 'Laporan tidak tersimpan',
        message: 'Periksa kembali field yang ditandai merah.'
      });
      return;
    }

    const created = s.addReport(form);
    s.pushToast({
      tone: 'ok',
      title: `Laporan ${created.id} tersimpan`,
      message: 'Status awal: Dilaporkan. Pantau perkembangannya di Laporan Saya.'
    });
    navigate(`/laporan-saya/${created.id}`);
  }

  const isHV = HIGH_VALUE_JENIS.includes(form.jenis);

  return (
    <>
      <PageHead
        title="Lapor Kehilangan Barang"
        desc="Isi ciri-ciri barang semampu Anda. Lokasi dan waktu cukup perkiraan — sistem tetap menerima laporannya."
        trace={{ req: ['R1'], story: ['US1'], ac: ['AC1.1', 'AC1.2', 'AC1.3'] }}
      />

      <form onSubmit={onSubmit} noValidate>
        <div className="stack">
          <Callout tone="info" title="Tidak ingat lokasi atau jam persisnya?">
            Tidak masalah. Cukup pilih area umum (misalnya "Kantin") dan rentang jam
            (misalnya 10.00–12.00). Laporan tetap tersimpan. <span className="mono">(C5 · AC1.2)</span>
          </Callout>

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
                    <option value="">— Tidak ingat —</option>
                    {WARNA.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Merek" htmlFor="merek" help="Kosongkan bila tidak ingat.">
                  <input
                    id="merek"
                    type="text"
                    value={form.merek}
                    onChange={set('merek')}
                    placeholder="mis. Eiger, Samsung"
                  />
                </Field>
              </div>

              <Field
                label="Ciri khusus"
                htmlFor="ciri"
                error={errors.ciri}
                help="Detail yang hanya diketahui pemilik akan membantu verifikasi nanti."
              >
                <textarea
                  id="ciri"
                  value={form.ciriKhusus}
                  onChange={set('ciriKhusus')}
                  placeholder="mis. ada stiker band di badan tumbler, sudut dompet lecet, gantungan boneka cokelat"
                />
              </Field>

              {isHV && (
                <Callout tone="warn" icon="lock" title="Barang ini tergolong high-value.">
                  Saat pengambilan nanti, Anda akan diminta datang ke pos membawa bukti kepemilikan
                  untuk diperiksa petugas. <span className="mono">(C2 · US-08)</span>
                </Callout>
              )}
            </div>
          </Card>

          <Card title="Perkiraan lokasi & waktu">
            <div className="stack">
              <div className="grid grid-2">
                <Field label="Area umum" htmlFor="area" help="Pilih yang paling mendekati.">
                  <select id="area" value={form.areaPerkiraan} onChange={set('areaPerkiraan')}>
                    <option value="">— Tidak yakin —</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Perkiraan tanggal" required error={errors.tanggalHilang} htmlFor="tgl">
                  <input id="tgl" type="date" value={form.tanggalHilang} onChange={set('tanggalHilang')} />
                </Field>
              </div>

              <div className="grid grid-2">
                <Field label="Perkiraan jam — dari" htmlFor="j1" help="Boleh dikosongkan.">
                  <input id="j1" type="time" value={form.waktuDari} onChange={set('waktuDari')} />
                </Field>
                <Field label="sampai" htmlFor="j2" error={errors.waktuSampai}>
                  <input id="j2" type="time" value={form.waktuSampai} onChange={set('waktuSampai')} />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Kontak">
            <Field
              label="Nomor yang bisa dihubungi"
              htmlFor="kontak"
              help="Dipakai petugas bila ada barang yang cocok. Tidak ditampilkan ke mahasiswa lain."
            >
              <input
                id="kontak"
                type="text"
                value={form.kontak}
                onChange={set('kontak')}
                placeholder="08xx-xxxx-xxxx"
              />
            </Field>
          </Card>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Kirim laporan</button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setForm(KOSONG);
                setErrors({});
              }}
            >
              Kosongkan form
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
