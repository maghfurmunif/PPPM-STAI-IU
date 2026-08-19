import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap, ArrowLeft, Loader2, ArrowRight, LogOut, Check, Bell, Layers } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Suspense, lazy, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

// Lazy load sub-sections for performance
const KKNSection = lazy(() => import('./sections/KKNSection'));
const SemproSection = lazy(() => import('./sections/SemproSection'));
const SkripsiSection = lazy(() => import('./sections/SkripsiSection'));
const ProfileSection = lazy(() => import('../shared/ProfileSection'));

export default function MahasiswaDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'User';
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  const menus = [
    { id: 'overview', name: 'Dashboard', path: '/dashboard/mahasiswa', icon: LayoutDashboard },
    { id: 'kkn-pribadi', name: 'KKN Pribadi', path: '/dashboard/mahasiswa/kkn', icon: Users },
    { id: 'kkn-mandiri', name: 'KKN Mandiri', path: '/dashboard/mahasiswa/kkn-mandiri', icon: Users },
    { id: 'sempro', name: 'Seminar Proposal', path: '/dashboard/mahasiswa/sempro', icon: BookOpen },
    { id: 'skripsi', name: 'Skripsi Pribadi', path: '/dashboard/mahasiswa/skripsi', icon: GraduationCap },
    { id: 'account', name: 'Profil Saya', path: '/dashboard/mahasiswa/profile', icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-200">
            <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xs uppercase tracking-widest italic text-slate-900">Student Portal</span>
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
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-white/20">
                  <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
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
                      location.pathname === menu.path ? "bg-primary text-white shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    <menu.icon size={18} />
                    <span>{menu.name}</span>
                  </Link>
                ))}
             </div>
             <button 
                onClick={handleLogout}
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
               <div className="text-[10px] text-slate-500">Student Portal</div>
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
              onClick={handleLogout}
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
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Workspace...</p>
            </div>
          }>
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="kkn" element={<KKNSection type="REGULER" />} />
              <Route path="kkn-mandiri" element={<KKNSection type="MANDIRI" />} />
              <Route path="sempro" element={<SemproSection />} />
              <Route path="skripsi" element={<SkripsiSection />} />
              <Route path="profile" element={<ProfileSection />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function DashboardOverview() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('logbooks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setActivities(data);
    };
    fetchActivities();
  }, [userId]);

  const [stats, setStats] = useState([
    { label: 'KKN Reguler', status: 'Cek Progress', color: 'primary', value: 0, icon: Users, path: '/dashboard/mahasiswa/kkn' },
    { label: 'KKN Mandiri', status: 'Cek Progress', color: 'slate', value: 0, icon: Users, path: '/dashboard/mahasiswa/kkn-mandiri' },
    { label: 'Tugas Akhir', status: 'Sedang Berjalan', color: 'slate', value: 0, icon: GraduationCap, path: '/dashboard/mahasiswa/skripsi' },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) return;
      
      const { data: kknReg } = await supabase
        .from('kkn_registrations')
        .select('*')
        .eq('student_id', userId)
        .eq('type', 'REGULER')
        .maybeSingle();
      
      const { data: kknMan } = await supabase
        .from('kkn_registrations')
        .select('*')
        .eq('student_id', userId)
        .eq('type', 'MANDIRI')
        .maybeSingle();

      const { data: skripsi } = await supabase
        .from('skripsi_registrations')
        .select('*')
        .eq('student_id', userId)
        .maybeSingle();

      const calculateKKNProgress = (reg: any) => {
        if (!reg) return 0;
        const statusOrder: Record<string, number> = {
          'PENDING': 15,
          'SUBMITTED': 30,
          'APPROVED': 40,
          'SURVEY': 50,
          'RKL': 60,
          'DEPLOYMENT': 75,
          'LOGBOOK': 85,
          'LPK': 90,
          'GRADING': 95,
          'COMPLETED': 100
        };
        
        let progress = 0;
        const baseStatus = reg.status?.replace('_PENDING', '');
        if (statusOrder[baseStatus]) {
          progress = statusOrder[baseStatus];
        } else {
          // If in PENDING, calculate based on uploaded docs
          let count = 0;
          const docs = reg.docs || {};
          const fields = ['transkrip', 'pembayaran', 'krs', 'kesehatan', 'foto', 'pernyataan', 'izinOrtu'];
          fields.forEach(f => { if (docs[f]) count++; });
          progress = Math.round((count / fields.length) * 15);
        }
        return progress;
      };

      setStats([
        { 
          label: 'KKN Reguler', 
          status: kknReg?.status || 'Cek Progress', 
          color: kknReg ? 'primary' : 'slate', 
          value: calculateKKNProgress(kknReg), 
          icon: Users, 
          path: '/dashboard/mahasiswa/kkn' 
        },
        { 
          label: 'KKN Mandiri', 
          status: kknMan?.status || 'Cek Progress', 
          color: kknMan ? 'primary' : 'slate', 
          value: calculateKKNProgress(kknMan), 
          icon: Users, 
          path: '/dashboard/mahasiswa/kkn-mandiri' 
        },
        { 
          label: 'Tugas Akhir', 
          status: skripsi?.status || 'Sedang Berjalan', 
          color: skripsi ? 'primary' : 'slate', 
          value: (() => {
            if (!skripsi) return 0;
            const statusMap: Record<string, number> = {
              'ENROLL': 10,
              'SUBMITTED': 25,
              'APPROVED': 40,
              'PROGRESS': 60,
              'DOCS_SUBMITTED': 80,
              'GRADING': 90,
              'COMPLETED': 100
            };
            return statusMap[skripsi.status] || 0;
          })(), 
          icon: GraduationCap, 
          path: '/dashboard/mahasiswa/skripsi' 
        },
      ]);
    };
    loadStats();
  }, [userId]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Halo, {localStorage.getItem('user_name') || 'Student'} 👋</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className={cn("card p-5 group hover:shadow-md transition-all cursor-pointer", i === 0 && "!bg-primary text-white border-primary")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", i === 0 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
                <stat.icon size={18} />
              </div>
              <span className={cn("text-xs font-medium", i === 0 ? "text-white/80" : "text-slate-500")}>{stat.status}</span>
            </div>
            <p className={cn("text-xs font-medium mb-1", i === 0 ? "text-white/80" : "text-slate-500")}>{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className={cn("text-2xl font-bold", i === 0 ? "text-white" : "text-slate-900")}>{stat.value}%</p>
              <div className={cn("h-2 w-20 rounded-full overflow-hidden", i === 0 ? "bg-white/20" : "bg-slate-100")}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={cn("h-full rounded-full", i === 0 ? "bg-white" : "bg-primary")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Timeline Aktivitas</h3>
          </div>
          <div className="space-y-3">
             {activities.length === 0 ? (
               <div className="p-6 text-center text-slate-500 text-sm">Belum ada aktivitas tercatat.</div>
             ) : (
               activities.map((activity, i) => (
                 <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-primary/5 transition-all cursor-pointer">
                   <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                   <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{activity.activity}</p>
                      <p className="text-xs text-slate-500">{new Date(activity.created_at).toLocaleDateString()}</p>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-4">Pusat Unduhan & Panduan</h3>
          <div className="space-y-3">
            {[
              { name: 'Template RKL (Rencana Kegiatan)', link: 'https://docs.google.com/document/d/1dmksXSoHHpg_5pJMYfOyuztYRU3Crj2M/edit?usp=drive_link&ouid=114172484404944105413&rtpof=true&sd=true' },
              { name: 'Template LPK (Laporan Pelaksanaan)', link: 'https://docs.google.com/document/d/1dmksXSoHHpg_5pJMYfOyuztYRU3Crj2M/edit?usp=drive_link&ouid=114172484404944105413&rtpof=true&sd=true' },
              { name: 'Buku Panduan KKN 2024/2025', link: 'https://docs.google.com/document/d/1dmksXSoHHpg_5pJMYfOyuztYRU3Crj2M/edit?usp=drive_link&ouid=114172484404944105413&rtpof=true&sd=true' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <span className="text-sm font-medium text-slate-700">{item.name}</span>
                 <button 
                   onClick={() => window.open(item.link, '_blank')}
                   className="text-sm font-medium text-primary hover:underline"
                 >
                   Download
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckIcon({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
