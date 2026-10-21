/* ============================================================
   Traceability.jsx — peta evidence P9 → layar aplikasi
   Sumber: P10 bagian H (Traceability Matrix) + change injection P11
   ============================================================ */

import { Link } from 'react-router-dom';
import { Card, PageHead, Callout } from '../components/ui.jsx';

const MATRIX = [
  {
    evidence: 'F2, F3, C5',
    need: 'N1, N2',
    req: 'R1',
    story: 'US1',
    ac: 'AC1.1, AC1.2, AC1.3',
    layar: 'Lapor Kehilangan',
    to: '/lapor'
  },
  {
    evidence: 'F3, F6, P1',
    need: 'N1',
    req: 'R5, R6',
    story: 'US2',
    ac: 'AC2.1, AC2.2, AC2.3',
    layar: 'Laporan Saya → Detail Laporan',
    to: '/laporan-saya'
  },
  {
    evidence: 'F7, F8, F9, C3',
    need: 'N5',
    req: 'R2, R9',
    story: 'US3',
    ac: 'AC3.1, AC3.2, AC3.3',
    layar: 'Catat Barang Temuan',
    to: '/staff/catat'
  },
  {
    evidence: 'F7, F8',
    need: 'N5, N6',
    req: 'R3, R4',
    story: 'US4',
    ac: 'AC4.1, AC4.2, AC4.3',
    layar: 'Record Barang Temuan · Detail Laporan (staff)',
    to: '/staff/record'
  },
  {
    evidence: 'F9, C1, C2',
    need: 'N7',
    req: 'R8, R9',
    story: 'US5',
    ac: 'AC5.1, AC5.2, AC5.3',
    layar: 'Verifikasi Klaim',
    to: '/staff/laporan'
  },
  {
    evidence: 'F5, C4',
    need: 'N8',
    req: 'R7',
    story: 'US6',
    ac: 'AC6.1, AC6.2',
    layar: 'Barang Temuan (mahasiswa)',
    to: '/barang-temuan'
  },
  {
    evidence: 'F3, F4',
    need: 'N3, N4',
    req: 'R10',
    story: 'US7',
    ac: 'AC7.1, AC7.2',
    layar: 'Beranda',
    to: '/beranda'
  },
  {
    evidence: 'F9, C1, C2, P7 + kartu P11',
    need: 'N7',
    req: 'R8 (diperluas), R9',
    story: 'US-08',
    ac: 'AC5.1–AC5.3 + pencatatan bukti',
    layar: 'Verifikasi Klaim (bagian high-value)',
    to: '/staff/laporan',
    baru: true
  }
];

const ATURAN = [
  ['AC1.1', 'Laporan tersimpan dengan ID dan status "Dilaporkan" bila jenis + minimal satu ciri diisi.'],
  ['AC1.2', 'Rentang jam dan area umum diterima; waktu/lokasi persis tidak pernah diminta.'],
  ['AC1.3', 'Tanpa jenis barang, laporan ditolak dan field wajib ditandai.'],
  ['AC2.1', 'Status ditampilkan sebagai salah satu tahap pada timeline laporan.'],
  ['AC2.2', 'Konfirmasi kecocokan oleh staff otomatis mengirim pemberitahuan pribadi ke pelapor.'],
  ['AC2.3', 'Pemberitahuan dan tampilan mahasiswa tidak pernah memuat isi atau detail rahasia barang.'],
  ['AC3.1', 'Record tersimpan dengan ID unik bila seluruh field wajib terisi.'],
  ['AC3.2', 'Tanpa lokasi penyimpanan, record tidak tersimpan.'],
  ['AC3.3', 'HP, laptop, dompet, dan KTM otomatis ditandai high-value dan wajib lokasi penyimpanan terpisah.'],
  ['AC4.1', 'Pencarian/filter hanya menampilkan record yang sesuai beserta lokasi penyimpanannya.'],
  ['AC4.2', 'Kandidat = jenis sama + tanggal ditemukan pada atau setelah perkiraan kehilangan.'],
  ['AC4.3', 'Status laporan tidak berubah sebelum staff menekan "Konfirmasi cocok".'],
  ['AC5.1', 'Form verifikasi berisi kecocokan detail spesifik, kecocokan lokasi hilang, dan catatan staff.'],
  ['AC5.2', 'Barang tidak dapat ditandai diserahkan bila verifikasi belum diisi atau tidak lolos.'],
  ['AC5.3', 'Barang high-value memunculkan langkah pemeriksaan bukti sebelum dapat diserahkan.'],
  ['AC6.1', 'Daftar barang temuan untuk mahasiswa hanya memuat jenis, area, dan tanggal ditemukan.'],
  ['AC6.2', 'Detail yang ditandai rahasia tidak pernah muncul di tampilan mahasiswa.'],
  ['AC7.1', 'Beranda memuat cara melapor kehilangan dan cara menyerahkan barang temuan.'],
  ['AC7.2', 'Beranda memuat lokasi pos security.']
];

export default function Traceability() {
  return (
    <>
      <PageHead
        title="Traceability Matrix"
        desc="Menghubungkan evidence discovery P9 → requirement P10 → user story → acceptance criteria → layar pada prototype ini."
      />

      <div className="stack">
        <Callout tone="info" title="Cara membaca halaman ini.">
          Setiap layar aplikasi membawa chip traceability di bagian atasnya. Tabel di bawah adalah
          versi lengkapnya, mengikuti P10 bagian H ditambah satu baris baru dari change injection P11.
        </Callout>

        <Card title="Evidence → Requirement → Story → AC → Layar" tight>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>P9 Evidence</th>
                  <th>User Need</th>
                  <th>Requirement</th>
                  <th>User Story</th>
                  <th>Acceptance Criteria</th>
                  <th>Layar di prototype</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((m) => (
                  <tr key={m.story}>
                    <td className="mono">{m.evidence}</td>
                    <td className="mono">{m.need}</td>
                    <td className="mono">{m.req}</td>
                    <td>
                      <span className="mono">{m.story}</span>
                      {m.baru && <span className="badge badge-brand" style={{ marginLeft: 6 }}>P11</span>}
                    </td>
                    <td className="mono">{m.ac}</td>
                    <td>
                      <Link to={m.to}>{m.layar}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Acceptance criteria yang benar-benar diberlakukan kode" tight>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>AC</th>
                  <th>Aturan yang dijalankan aplikasi</th>
                </tr>
              </thead>
              <tbody>
                {ATURAN.map(([ac, teks]) => (
                  <tr key={ac}>
                    <td className="mono">{ac}</td>
                    <td className="small">{teks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Callout tone="warn" icon="alert" title="Batasan prototype.">
          Ini frontend saja: tidak ada backend, autentikasi, maupun basis data. Peran Mahasiswa dan
          Staff dipilih lewat switcher di sidebar — bukan login sungguhan. Seluruh data adalah data
          dummy yang disimpan di localStorage browser.
        </Callout>
      </div>
    </>
  );
}
