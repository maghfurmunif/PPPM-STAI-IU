import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, BarChart3, Globe, GraduationCap, Landmark, Loader2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { publicService, Announcement } from '@/src/services/publicService';
import { cn } from '@/src/lib/utils';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_role'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'MAHASISWA');
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    const savedId = localStorage.getItem('user_id');
    if (savedRole && savedId && window.location.pathname === '/') {
      navigate(`/dashboard/${savedRole.toLowerCase()}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, annData] = await Promise.all([
          publicService.getGlobalStats(),
          publicService.getAnnouncements()
        ]);
        setStats(statsData);
        setAnnouncements(annData);
      } catch (e) {
        console.error('Landing page fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem('user_role'));
      setUserRole(localStorage.getItem('user_role') || 'MAHASISWA');
    };
    window.addEventListener('storage', checkLogin);
    window.addEventListener('auth-change', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('auth-change', checkLogin);
    };
  }, []);

  const getDashboardPath = () => `/dashboard/${userRole.toLowerCase()}`;

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[550px] overflow-hidden bg-white">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center py-16">
          <div className="max-w-3xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Portal Akademik</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight"
            >
              Kelola Penelitian &<br />
              <span className="text-primary">Pengabdian</span> dengan Mudah
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg leading-relaxed max-w-xl"
            >
              Pusat Penelitian dan Pengabdian kepada Masyarakat STAI Ihyaul Ulum Gresik. 
              Platform digital untuk manajemen akademik.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link 
                to={isLoggedIn ? getDashboardPath() : "/register"} 
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all flex items-center group"
              >
                {isLoggedIn ? 'Buka Dashboard' : 'Mulai Sekarang'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link 
                to="/panduan" 
                className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-primary/30 transition-all"
              >
                Pelajari Panduan
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div className="card p-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
            <BookOpen size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Penelitian Dosen</h3>
          <p className="text-slate-500 text-sm leading-relaxed">Akses dan kelola publikasi ilmiah, penelitian inovatif, dan karya akademik dosen.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">{stats?.penelitian || 0} Terdaftar</span>
            <ArrowRight size={16} className="text-primary" />
          </div>
        </div>

        <div className="card p-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
            <Globe size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Pengabdian KKN</h3>
          <p className="text-slate-500 text-sm leading-relaxed">Jembatani pengetahuan akademik dengan dampak sosial langsung bagi masyarakat.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">{stats?.kkn || 0} Proyek</span>
            <ArrowRight size={16} className="text-primary" />
          </div>
        </div>

        <div className="card p-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
            <BarChart3 size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Tugas Akhir</h3>
          <p className="text-slate-500 text-sm leading-relaxed">Manajemen Seminar Proposal dan Skripsi yang efektif untuk kelulusan mahasiswa.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Digitalized</span>
            <ArrowRight size={16} className="text-primary" />
          </div>
        </div>
      </section>

      {/* Stats and Announcements */}
      <section className="container mx-auto px-4 grid lg:grid-cols-3 gap-8 pt-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Statistik</h2>
            <p className="text-slate-500 text-sm mt-1">Data real-time dari sistem</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Mahasiswa', value: stats?.mahasiswaCount || 0, sub: 'Terverifikasi', icon: Users },
              { label: 'Dosen', value: stats?.dosenCount || 0, sub: 'Pembimbing Aktif', icon: GraduationCap },
              { label: 'Total Aktivitas', value: stats?.totalActivity || 0, sub: 'KKN, Skripsi, Riset', icon: BarChart3 }
            ].map((stat, i) => (
              <div key={i} className={cn("card p-5 hover:shadow-md transition-all", i === 0 && "!bg-primary text-white border-primary")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", i === 0 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
                  <stat.icon size={18} />
                </div>
                <p className={cn("text-sm font-medium mb-1", i === 0 ? "text-white/80" : "text-slate-500")}>{stat.label}</p>
                <p className={cn("text-2xl font-bold", i === 0 ? "text-white" : "text-slate-900")}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="card !bg-primary p-8 relative overflow-hidden border-primary">
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-bold text-white">Bergabung dengan Kami</h3>
              <p className="text-white/80 max-w-md">Berdampingan membangun ekosistem akademik yang unggul.</p>
              <Link 
                to={isLoggedIn ? getDashboardPath() : "/register"} 
                className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                {isLoggedIn ? 'Buka Dashboard' : 'Daftar Sekarang'}
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-900">Pengumuman</h2>
             <Link to="/pengumuman" className="text-sm text-primary font-medium hover:underline">Semua</Link>
          </div>
          <div className="space-y-3">
            {announcements.length === 0 ? (
               <div className="card p-8 text-center">
                  <Calendar className="mx-auto text-slate-300 mb-3" size={32} />
                  <p className="text-sm text-slate-500">Belum ada pengumuman</p>
               </div>
            ) : (
              announcements.map((item, i) => (
                <div key={i} className="card p-4 hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
