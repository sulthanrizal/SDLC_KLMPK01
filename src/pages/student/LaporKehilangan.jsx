/* ============================================================
   LaporKehilangan.jsx — form laporan barang hilang
   Memenuhi: R1 · US1 · AC1.1 · AC1.2 · AC1.3 · C5
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHead, Field, Callout } from '../../components/ui.jsx';
import Icon from '../../components/Icon.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { AREAS, JENIS_BARANG, WARNA, HIGH_VALUE_JENIS } from '../../data/seed.js';

const CIRI_MAX = 300;
const DRAFT_KEY = 'draft-lapor-kehilangan';

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

/* Dipakai ringkasan error: kunci error di validate() -> id field & label */
const ERROR_TARGET = {
  jenis: { id: 'jenis', label: 'Jenis barang' },
  ciri: { id: 'ciri', label: 'Ciri khusus' },
  tanggalHilang: { id: 'tgl', label: 'Perkiraan tanggal' },
  waktuSampai: { id: 'j2', label: 'Jam selesai' },
  kontak: { id: 'kontak', label: 'Nomor yang bisa dihubungi' }
};

const hariIniISO = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/* Nomor HP Indonesia: diawali +62/62/08, spasi dan tanda hubung diabaikan */
const kontakValid = (v) => {
  const norm = v.replace(/[\s-]/g, '');
  return /^(\+62|62|0)8[1-9][0-9]{5,11}$/.test(norm);
};

export default function LaporKehilangan() {
  const s = useStore();
  const navigate = useNavigate();

  /* Draft anti-hilang: isian dipulihkan dari localStorage bila ada
     (mis. tab tertutup atau refresh di tengah mengisi). */
  const [form, setForm] = useState(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return { ...KOSONG, ...JSON.parse(raw) };
    } catch {
      /* draft rusak -> abaikan, mulai dari kosong */
    }
    return KOSONG;
  });
  const [draftDipulihkan, setDraftDipulihkan] = useState(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? Object.values(JSON.parse(raw)).some((v) => v !== '') : false;
    } catch {
      return false;
    }
  });
  const [errors, setErrors] = useState({});
  const summaryRef = useRef(null);

  useEffect(() => {
    try {
      /* Form kosong = tidak ada yang perlu disimpan; hapus key supaya
         tidak menumpuk draft kosong di localStorage. */
      const kosongSemua = Object.values(form).every((v) => v === '');
      if (kosongSemua) {
        localStorage.removeItem(DRAFT_KEY);
      } else {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }
    } catch {
      /* localStorage penuh/tidak tersedia -> draft nonaktif, form tetap jalan */
    }
  }, [form]);

  /* AC1.3 (diperkuat): saat submit gagal, fokus pindah ke ringkasan error
     supaya pengguna keyboard/screen reader langsung tahu apa yang kurang. */
  useEffect(() => {
    if (Object.keys(errors).length > 0 && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [errors]);

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
    } else if (form.tanggalHilang > hariIniISO()) {
      /* Kasus tepi: tanggal kehilangan mustahil di masa depan */
      err.tanggalHilang = 'Tanggal kehilangan tidak boleh tanggal yang akan datang.';
    }

    /* AC1.2 — rentang waktu & area boleh perkiraan, jadi TIDAK divalidasi ketat.
       Yang dicek hanya konsistensi bila dua-duanya diisi. */
    if (form.waktuDari && form.waktuSampai && form.waktuDari > form.waktuSampai) {
      err.waktuSampai = 'Jam selesai harus setelah jam mulai.';
    }

    /* Kasus tepi: nomor kontak opsional, tapi bila diisi harus berformat nomor HP */
    if (form.kontak.trim() && !kontakValid(form.kontak.trim())) {
      err.kontak = 'Format nomor tidak dikenali. Gunakan nomor HP, mis. 0812-3456-7890.';
    }

    return err;
  }

  function kosongkan() {
    setForm(KOSONG);
    setErrors({});
    setDraftDipulihkan(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* abaikan */
    }
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
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* abaikan */
    }
    s.pushToast({
      tone: 'ok',
      title: `Laporan ${created.id} tersimpan`,
      message: 'Status awal: Dilaporkan. Pantau perkembangannya di Laporan Saya.'
    });
    navigate(`/laporan-saya/${created.id}`);
  }

  const isHV = HIGH_VALUE_JENIS.includes(form.jenis);
  const daftarError = Object.entries(errors).filter(([, msg]) => msg);

  return (
    <>
      <PageHead
        title="Lapor Kehilangan Barang"
        desc="Isi ciri-ciri barang semampu Anda. Lokasi dan waktu cukup perkiraan — sistem tetap menerima laporannya."
        trace={{ req: ['R1'], story: ['US1'], ac: ['AC1.1', 'AC1.2', 'AC1.3'] }}
      />

      <form onSubmit={onSubmit} noValidate>
        <div className="stack">
          {draftDipulihkan && (
            <Callout tone="info" icon="refresh" title="Isian sebelumnya dipulihkan.">
              Formulir ini menyimpan isian Anda secara otomatis. Bila ingin mulai dari
              awal, tekan "Kosongkan form" di bawah.
            </Callout>
          )}

          {daftarError.length > 0 && (
            <div
              className="callout callout-danger"
              role="alert"
              tabIndex={-1}
              ref={summaryRef}
            >
              <Icon name="alert" size={17} />
              <div>
                <strong>Laporan belum bisa dikirim.</strong>{' '}
                Periksa isian berikut:
                <ul className="err-list">
                  {daftarError.map(([k, msg]) => (
                    <li key={k}>
                      <a href={`#${ERROR_TARGET[k]?.id ?? k}`}>
                        {ERROR_TARGET[k]?.label ?? k}: {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
                help={`${CIRI_MAX - form.ciriKhusus.length} karakter tersisa. Detail yang hanya diketahui pemilik akan membantu verifikasi nanti.`}
              >
                <textarea
                  id="ciri"
                  value={form.ciriKhusus}
                  onChange={set('ciriKhusus')}
                  maxLength={CIRI_MAX}
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
              error={errors.kontak}
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
              onClick={kosongkan}
            >
              Kosongkan form
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
