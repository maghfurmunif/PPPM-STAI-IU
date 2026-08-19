import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, BookOpen, GraduationCap, 
  FlaskConical, HeartHandshake, Settings, 
  Bell, FileText, Activity, Layers, Search, Filter,
  Globe, LogOut, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Suspense, lazy, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { kknService } from '@/src/services/kknService';
import { semproService } from '@/src/services/semproService';
import { skripsiService } from '@/src/services/skripsiService';
import { publicService } from '@/src/services/publicService';
import { supabase } from '@/src/lib/supabase';

// Admin Sections
const AdminManagement = lazy(() => import('./sections/AdminManagement'));
const AdminKKN = lazy(() => import('./sections/AdminKKN'));
const AdminSempro = lazy(() => import('./sections/AdminSempro'));
const AdminSkripsi = lazy(() => import('./sections/AdminSkripsi'));
const AdminPenelitian = lazy(() => import('./sections/AdminPenelitian'));
const AdminPengabdian = lazy(() => import('./sections/AdminPengabdian'));
const AdminDokumentasi = lazy(() => import('./sections/AdminDokumentasi'));
const AdminUsers = lazy(() => import('./sections/AdminUsers'));
const AdminAnnouncements = lazy(() => import('./sections/AdminAnnouncements'));
const AdminGuides = lazy(() => import('./sections/AdminGuides'));

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menus = [
    { id: 'overview', name: 'Dashboard', path: '/dashboard/admin', icon: BarChart3 },
    { id: 'kkn', name: 'Kelola KKN', path: '/dashboard/admin/kkn', icon: Globe },
    { id: 'penelitian', name: 'Penelitian Dosen', path: '/dashboard/admin/penelitian', icon: FlaskConical },
    { id: 'pengabdian', name: 'Pengabdian Dosen', path: '/dashboard/admin/pengabdian', icon: HeartHandshake },
    { id: 'dokumentasi', name: 'Kelola Dokumentasi', path: '/dashboard/admin/dokumentasi', icon: FileText },
    { id: 'sempro', name: 'Seminar Proposal', path: '/dashboard/admin/sempro', icon: BookOpen },
    { id: 'skripsi', name: 'Skripsi Mahasiswa', path: '/dashboard/admin/skripsi', icon: GraduationCap },
    { id: 'announcements', name: 'Kelola Pengumuman', path: '/dashboard/admin/announcements', icon: Bell },
    { id: 'guides', name: 'Kelola Panduan', path: '/dashboard/admin/guides', icon: Layers },
    { id: 'users', name: 'Manajemen User', path: '/dashboard/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img 
            src="https://res.cloudinary.com/dlvvzsyzv/image/upload/q_auto/f_auto/v1779118998/images_nvrkgt.jpg" 
            alt="Logo" 
            className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-1"
          />
          <span className="font-black text-xs uppercase tracking-widest italic text-slate-900">Admin Panel</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-50 rounded-xl text-slate-900">
          {isMobileMenuOpen ? <Bell className="rotate-90" /> : <Layers />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-40 lg:hidden bg-slate-900 p-6 flex flex-col space-y-4"
          >
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://res.cloudinary.com/dlvvzsyzv/image/upload/q_auto/f_auto/v1779118998/images_nvrkgt.jpg" 
                    alt="Logo" 
                    className="w-10 h-10 rounded-xl object-contain bg-white p-1"
                  />
                  <span className="font-black text-xs uppercase tracking-widest italic text-white">PPPM Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white ring-1 ring-white/20 p-2 rounded-xl">Tutup</button>
             </div>
             <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                {menus.map(menu => (
                  <Link 
                    key={menu.id} 
                    to={menu.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-[0.2em]",
                      location.pathname === menu.path ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    <menu.icon size={18} />
                    <span>{menu.name}</span>
                  </Link>
                ))}
             </div>
             <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="w-full py-5 bg-red-600/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Logout Sesi
             </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col sticky top-0 h-screen p-4 z-20">
        <div className="bg-white h-full rounded-3xl p-4 flex flex-col shadow-sm border border-slate-100">
          <div className="mb-6 px-4 flex items-center space-x-3">
             <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-200">
               <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
             </div>
             <div>
               <div className="text-sm font-bold text-slate-900">PPPM</div>
               <div className="text-[10px] text-slate-500">Admin Panel</div>
             </div>
          </div>
          <div className="space-y-1 overflow-y-auto side-scrollbar pr-2">
            {menus.map((menu) => (
              <Link 
                key={menu.id} 
                to={menu.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  (location.pathname === menu.path)
                    ? "bg-primary text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <menu.icon size={18} />
                <span>{menu.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-4">
            <button 
              onClick={() => {
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_name');
                window.location.href = '/';
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-50 text-slate-600 rounded-xl font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authorizing Admin Access...</p>
            </div>
          }>
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="kkn" element={<AdminKKN />} />
              <Route path="penelitian" element={<AdminPenelitian />} />
              <Route path="pengabdian" element={<AdminPengabdian />} />
              <Route path="dokumentasi" element={<AdminDokumentasi />} />
              <Route path="sempro" element={<AdminSempro />} />
              <Route path="skripsi" element={<AdminSkripsi />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="guides" element={<AdminGuides />} />
              <Route path="users" element={<AdminUsers />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function AdminOverview() {
  const [totals, setTotals] = useState({ pen: 0, penSelesai: 0, peng: 0, pengSelesai: 0, kkn: 0, sempro: 0 });
  const [monthlyData, setMonthlyData] = useState<Record<string, { bulan: string; selesai: number; aktif: number }[]>>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, penMonth, pengMonth, kknMonth, semMonth, acts] = await Promise.all([
          publicService.getGlobalStats(),
          publicService.getMonthlyStats('penelitian_registrations'),
          publicService.getMonthlyStats('pengabdian_registrations'),
          publicService.getMonthlyStats('kkn_registrations'),
          publicService.getMonthlyStats('sempro_registrations'),
          publicService.getRecentActivities(),
        ]);

        setTotals({
          pen: stats.penelitian, penSelesai: stats.penelitianSelesai || 0,
          peng: stats.pengabdian, pengSelesai: stats.pengabdianSelesai || 0,
          kkn: stats.kkn, sempro: stats.sempro,
        });
        setMonthlyData({ penelitian: penMonth, pengabdian: pengMonth, kkn: kknMonth, sempro: semMonth });
        setActivities(acts);
      } catch (e) {
        console.error('Admin stats fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      label: 'Penelitian Dosen', icon: FlaskConical, color: '#2D5016',
      total: totals.pen, selesai: totals.penSelesai, aktif: totals.pen - totals.penSelesai,
      tableKey: 'penelitian',
    },
    {
      label: 'Pengabdian Dosen', icon: HeartHandshake, color: '#3B7A28',
      total: totals.peng, selesai: totals.pengSelesai, aktif: totals.peng - totals.pengSelesai,
      tableKey: 'pengabdian',
    },
    {
      label: 'KKN Aktif', icon: Globe, color: '#4A9C2E',
      total: totals.kkn, selesai: 0, aktif: totals.kkn,
      tableKey: 'kkn',
    },
    {
      label: 'Sempro Aktif', icon: BookOpen, color: '#5AB836',
      total: totals.sempro, selesai: 0, aktif: totals.sempro,
      tableKey: 'sempro',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Selamat datang di panel admin PPPM.</p>
        </div>
      </div>

      {/* 4 Stat Cards with Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="card p-5 bg-white border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.color + '15' }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{card.label}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-900">{card.total}</span>
                    <span className="text-[10px] text-slate-400">total</span>
                  </div>
                </div>
              </div>
              {card.selesai > 0 && (
                <div className="text-right">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] text-slate-500">Selesai</span>
                    <span className="text-sm font-bold text-primary">{card.selesai}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-300" />
                    <span className="text-[10px] text-slate-500">Aktif</span>
                    <span className="text-sm font-bold text-emerald-600">{card.aktif}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mini Bar Chart */}
            <div className="h-[100px] mt-2">
              {!loading && monthlyData[card.tableKey] ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData[card.tableKey]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} interval={2} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', padding: '8px' }}
                      formatter={(value: number, name: string) => [value, name === 'selesai' ? 'Selesai' : 'Aktif']}
                    />
                    <Bar dataKey="selesai" stackId="a" fill="#2D5016" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="aktif" stackId="a" fill="#86B874" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" size={16} /></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <div className="card">
               <h3 className="font-semibold text-slate-900 mb-4">Modul Akses Cepat</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {[
                   { label: 'Kelola KKN', path: '/dashboard/admin/kkn', icon: Globe },
                   { label: 'Seminar Proposal', path: '/dashboard/admin/sempro', icon: BookOpen },
                   { label: 'Skripsi Mahasiswa', path: '/dashboard/admin/skripsi', icon: GraduationCap },
                   { label: 'Penelitian Dosen', path: '/dashboard/admin/penelitian', icon: FlaskConical },
                   { label: 'Pengabdian Dosen', path: '/dashboard/admin/pengabdian', icon: HeartHandshake },
                   { label: 'Kelola Dokumentasi', path: '/dashboard/admin/dokumentasi', icon: FileText },
                   { label: 'Kelola Pengumuman', path: '/dashboard/admin/announcements', icon: Bell },
                   { label: 'Kelola Panduan', path: '/dashboard/admin/guides', icon: Layers },
                 ].map((mod, idx) => (
                   <Link key={idx} to={mod.path} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-all text-slate-600">
                      <mod.icon size={20} className="mb-2" />
                      <span className="text-xs font-medium text-center">{mod.label}</span>
                   </Link>
                 ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="font-semibold text-slate-900 mb-4">Aktivitas Terbaru</h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto">
                 {activities.map((act, idx) => (
                   <div key={act.id} className="flex items-start space-x-3 pb-3 border-b border-slate-100 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                         <p className="text-sm font-medium text-slate-700">{act.name}</p>
                         <p className="text-xs text-slate-500">{act.action}</p>
                         <p className="text-xs text-slate-400 mt-1">{act.time ? new Date(act.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
