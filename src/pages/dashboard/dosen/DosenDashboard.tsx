
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  FlaskConical, HeartHandshake, Settings, 
  Bell, FileText, Activity, Layers, Search, Filter,
  Globe, LogOut, ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { penelitianService } from '@/src/services/penelitianService';

// Lazy load dosen sections
const PenelitianDosen = lazy(() => import('./sections/PenelitianDosen'));
const PengabdianDosen = lazy(() => import('./sections/PengabdianDosen'));
const DosenDokumentasi = lazy(() => import('./sections/DosenDokumentasi'));
const ProfileSection = lazy(() => import('../shared/ProfileSection'));

export default function DosenDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menus = [
    { id: 'overview', name: 'Dashboard', path: '/dashboard/dosen', icon: LayoutDashboard },
    { id: 'penelitian', name: 'Penelitian', path: '/dashboard/dosen/penelitian', icon: FlaskConical },
    { id: 'pengabdian', name: 'Pengabdian', path: '/dashboard/dosen/pengabdian', icon: HeartHandshake },
    { id: 'jurnal', name: 'Jurnal STAIU', path: 'https://jurnal.staiiu.ac.id', icon: Globe, external: true },
    { id: 'dokumentasi', name: 'Dokumentasi', path: '/dashboard/dosen/dokumentasi', icon: Layers },
    { id: 'settings', name: 'Profil Saya', path: '/dashboard/dosen/profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-200">
            <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xs uppercase tracking-widest italic text-slate-900">Dosen Portal</span>
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
                  menu.external ? (
                    <a key={menu.id} href={menu.path} target="_blank" rel="noreferrer" className="flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white">
                      <menu.icon size={18} />
                      <span>{menu.name}</span>
                    </a>
                  ) : (
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
                  )
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
               <div className="text-[10px] text-slate-500">Dosen Portal</div>
             </div>
          </div>
          <div className="space-y-1 overflow-y-auto side-scrollbar pr-2">
            {menus.map((menu) => (
              menu.external ? (
                <a 
                  key={menu.id} 
                  href={menu.path}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-slate-600 hover:bg-slate-50"
                >
                   <menu.icon size={18} />
                   <span>{menu.name}</span>
                </a>
              ) : (
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
              )
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
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authorizing Faculty Access...</p>
            </div>
          }>
            <Routes>
              <Route index element={<DosenOverview />} />
              <Route path="penelitian" element={<PenelitianDosen />} />
              <Route path="pengabdian" element={<PengabdianDosen />} />
              <Route path="dokumentasi" element={<DosenDokumentasi />} />
              <Route path="profile" element={<ProfileSection />} />
              <Route path="*" element={<div className="card p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs italic">Section Under Development</div>} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function DosenOverview() {
  const navigate = useNavigate();
  return (
     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Halo, {localStorage.getItem('user_name') || 'Dosen'} 👋</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[
             { title: 'Penelitian Dosen', desc: 'Kelola proposal dan hasil riset.', icon: FlaskConical, path: 'penelitian' },
             { title: 'Pengabdian Masyarakat', desc: 'Monitoring aktivitas pengabdian.', icon: HeartHandshake, path: 'pengabdian' },
             { title: 'Arsip Dokumentasi', desc: 'Simpan semua karya ilmiah Anda.', icon: Layers, path: 'dokumentasi' },
           ].map((card, i) => (
             <div 
               key={i} 
               onClick={() => navigate(card.path)}
               className={cn("card p-6 group hover:shadow-md transition-all cursor-pointer", i === 0 && "!bg-primary text-white border-primary")}
             >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", i === 0 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
                    <card.icon size={18} />
                  </div>
                </div>
                <p className={cn("text-xs font-medium mb-1", i === 0 ? "text-white/80" : "text-slate-500")}>{card.desc}</p>
                <p className={cn("text-lg font-bold", i === 0 ? "text-white" : "text-slate-900")}>{card.title}</p>
             </div>
           ))}
        </div>
     </motion.div>
  );
}
