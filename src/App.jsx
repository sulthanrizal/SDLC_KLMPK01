import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useStore } from './store/StoreContext.jsx';

import Beranda from './pages/student/Beranda.jsx';
import LaporKehilangan from './pages/student/LaporKehilangan.jsx';
import LaporanSaya from './pages/student/LaporanSaya.jsx';
import DetailLaporan from './pages/student/DetailLaporan.jsx';
import BarangTemuan from './pages/student/BarangTemuan.jsx';

import Dashboard from './pages/staff/Dashboard.jsx';
import CatatTemuan from './pages/staff/CatatTemuan.jsx';
import CariRecord from './pages/staff/CariRecord.jsx';
import DaftarLaporan from './pages/staff/DaftarLaporan.jsx';
import DetailLaporanStaff from './pages/staff/DetailLaporanStaff.jsx';
import Verifikasi from './pages/staff/Verifikasi.jsx';

import Traceability from './pages/Traceability.jsx';

export default function App() {
  const { role } = useStore();
  const home = role === 'staff' ? '/staff' : '/beranda';

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to={home} replace />} />

        {/* Mahasiswa */}
        <Route path="beranda" element={<Beranda />} />
        <Route path="lapor" element={<LaporKehilangan />} />
        <Route path="laporan-saya" element={<LaporanSaya />} />
        <Route path="laporan-saya/:id" element={<DetailLaporan />} />
        <Route path="barang-temuan" element={<BarangTemuan />} />

        {/* Staff — NFR2: menu ini hanya muncul saat peran Staff Security aktif */}
        <Route path="staff" element={<Dashboard />} />
        <Route path="staff/catat" element={<CatatTemuan />} />
        <Route path="staff/record" element={<CariRecord />} />
        <Route path="staff/laporan" element={<DaftarLaporan />} />
        <Route path="staff/laporan/:id" element={<DetailLaporanStaff />} />
        <Route path="staff/verifikasi/:id" element={<Verifikasi />} />

        <Route path="traceability" element={<Traceability />} />
        <Route path="*" element={<Navigate to={home} replace />} />
      </Route>
    </Routes>
  );
}
