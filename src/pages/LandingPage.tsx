import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, BarChart3, Globe, GraduationCap, Landmark, Loader2, Calendar, FlaskConical, FileText, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { publicService, Announcement } from '@/src/services/publicService';
import { cn } from '@/src/lib/utils';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_role'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'MAHASISWA');
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pubByYear, setPubByYear] = useState<any[]>([]);
  const [pubByDosen, setPubByDosen] = useState<any[]>([]);
  const [pubByType, setPubByType] = useState<any[]>([]);
  const [penelitianByYear, setPenelitianByYear] = useState<any[]>([]);
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
        const results = await Promise.allSettled([
          publicService.getGlobalStats(),
          publicService.getAnnouncements(),
          publicService.getPublicationByYear(),
          publicService.getPublicationByDosen(),
          publicService.getPublicationByType(),
          publicService.getPenelitianByYear()
        ]);
        const getValue = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : null;
        setStats(getValue(results[0]));
        setAnnouncements(getValue(results[1]) || []);
        setPubByYear(getValue(results[2]) || []);
        setPubByDosen(getValue(results[3]) || []);
        setPubByType(getValue(results[4]) || []);
        setPenelitianByYear(getValue(results[5]) || []);
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
          
          {/* Ringkasan Utama */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Mahasiswa', value: stats?.mahasiswaCount || 0, sub: 'Terverifikasi', icon: Users },
              { label: 'Dosen', value: stats?.dosenCount || 0, sub: 'Pembimbing Aktif', icon: GraduationCap },
              { label: 'Total Aktivitas', value: stats?.totalActivity || 0, sub: 'Semua Kategori', icon: BarChart3 }
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

          {/* Detail Aktivitas */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Detail Aktivitas</h3>
              <span className="text-xs text-slate-500 font-medium">Real-time</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Penelitian Dosen', value: stats?.penelitian || 0, sub: `${stats?.penelitianSelesai || 0} selesai / ${stats?.penelitianAktif || 0} aktif`, icon: FlaskConical, color: 'bg-blue-50 text-blue-600' },
                { label: 'Pengabdian Dosen', value: stats?.pengabdian || 0, sub: `${stats?.pengabdianSelesai || 0} selesai / ${stats?.pengabdianAktif || 0} aktif`, icon: Globe, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Skripsi', value: stats?.skripsi || 0, sub: 'Tugas Akhir', icon: BookOpen, color: 'bg-violet-50 text-violet-600' },
                { label: 'KKN', value: stats?.kkn || 0, sub: 'Kuliah Kerja Nyata', icon: Users, color: 'bg-amber-50 text-amber-600' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", item.color)}>
                    <item.icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-0.5">{item.value}</p>
                  <p className="text-xs font-semibold text-slate-700 mb-1">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistik Dokumentasi */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Statistik Dokumentasi</h3>
              <span className="text-xs text-slate-500 font-medium">{stats?.dokumentasiTotal || 0} Total</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { label: 'Jurnal', value: stats?.jurnal || 0, icon: FileText, color: 'bg-blue-500' },
                { label: 'Penelitian', value: stats?.penelitianDoc || 0, icon: FlaskConical, color: 'bg-emerald-500' },
                { label: 'Pengabdian', value: stats?.pengabdianDoc || 0, icon: Globe, color: 'bg-amber-500' },
                { label: 'Buku', value: stats?.buku || 0, icon: Bookmark, color: 'bg-violet-500' },
                { label: 'Prosiding', value: stats?.prosiding || 0, icon: FileText, color: 'bg-rose-500' },
                { label: 'Lainnya', value: stats?.lainnya || 0, icon: BarChart3, color: 'bg-slate-500' }
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 text-white", item.color)}>
                    <item.icon size={14} />
                  </div>
                  <p className="text-xl font-bold text-slate-900 mb-0.5">{item.value}</p>
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grafik Penelitian Dosen per Tahun — Skema */}
          {penelitianByYear.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-5">Statistik Penelitian Dosen per Tahun</h3>
              <div className="flex items-end gap-2 h-48">
                {penelitianByYear.map((item, i) => {
                  const total = item.internal + item.mandiri + item.hibah + item.kerjasama;
                  const maxTotal = Math.max(...penelitianByYear.map((y: any) => y.internal + y.mandiri + y.hibah + y.kerjasama), 1);
                  const bars = [
                    { val: item.internal, color: 'bg-blue-500', hover: 'hover:bg-blue-600', label: 'Internal' },
                    { val: item.mandiri, color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', label: 'Mandiri' },
                    { val: item.hibah, color: 'bg-amber-400', hover: 'hover:bg-amber-500', label: 'Hibah' },
                    { val: item.kerjasama, color: 'bg-violet-500', hover: 'hover:bg-violet-600', label: 'Kerjasama' },
                  ];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{total}</div>
                      <div className="w-full flex gap-0.5" style={{ height: '120px', alignItems: 'flex-end' }}>
                        {bars.map((bar, bi) => (
                          <div key={bi} className={`flex-1 ${bar.color} rounded-t-md transition-all ${bar.hover}`} style={{ height: `${(bar.val / maxTotal) * 100}%` }} title={`${bar.label}: ${bar.val}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">{item.tahun}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-blue-500" />Internal</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-emerald-500" />Mandiri</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-amber-400" />Hibah</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-violet-500" />Kerjasama</span>
              </div>
            </div>
          )}

          {/* Grafik Publikasi per Tahun */}
          {pubByYear.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-5">Publikasi per Tahun</h3>
              <div className="flex items-end gap-2 h-48">
                {pubByYear.map((item, i) => {
                  const total = item.jurnal + item.buku + item.prosiding + item.penelitian;
                  const maxTotal = Math.max(...pubByYear.map((y: any) => y.jurnal + y.buku + y.prosiding + y.penelitian), 1);
                  const hJurnal = (item.jurnal / maxTotal) * 100;
                  const hBuku = (item.buku / maxTotal) * 100;
                  const hProsiding = (item.prosiding / maxTotal) * 100;
                  const hPenelitian = (item.penelitian / maxTotal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{total}</div>
                      <div className="w-full flex gap-0.5" style={{ height: '120px', alignItems: 'flex-end' }}>
                        <div className="flex-1 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${hJurnal}%` }} title={`Jurnal: ${item.jurnal}`} />
                        <div className="flex-1 bg-violet-500 rounded-t-md transition-all hover:bg-violet-600" style={{ height: `${hBuku}%` }} title={`Buku: ${item.buku}`} />
                        <div className="flex-1 bg-rose-500 rounded-t-md transition-all hover:bg-rose-600" style={{ height: `${hProsiding}%` }} title={`Prosiding: ${item.prosiding}`} />
                        <div className="flex-1 bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600" style={{ height: `${hPenelitian}%` }} title={`Penelitian: ${item.penelitian}`} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">{item.tahun}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-blue-500" />Jurnal</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-violet-500" />Buku</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-rose-500" />Prosiding</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-emerald-500" />Penelitian</span>
              </div>
            </div>
          )}

          {/* Grafik Publikasi per Dosen & Jenis */}
          <div className="grid md:grid-cols-2 gap-6">
            {pubByDosen.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Publikasi per Dosen</h3>
                <div className="flex items-end gap-1.5 h-48">
                  {pubByDosen.map((item, i) => {
                    const maxTotal = pubByDosen[0]?.total || 1;
                    const h = (item.total / maxTotal) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.total}</div>
                        <div className="w-full flex justify-center" style={{ height: '120px', alignItems: 'flex-end' }}>
                          <div className="w-full bg-primary rounded-t-md transition-all hover:bg-primary/80" style={{ height: `${h}%` }} title={`${item.dosenName}: ${item.total}`} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-1 truncate w-full text-center" title={item.dosenName}>{item.dosenName.split(' ').pop()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pubByType.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Jenis Publikasi</h3>
                <div className="flex items-end gap-3 h-48">
                  {pubByType.map((item, i) => {
                    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];
                    const hoverColors = ['hover:bg-blue-600', 'hover:bg-emerald-600', 'hover:bg-violet-600', 'hover:bg-amber-600', 'hover:bg-rose-600', 'hover:bg-slate-600'];
                    const color = colors[i % colors.length];
                    const hoverColor = hoverColors[i % hoverColors.length];
                    const maxJml = pubByType[0]?.jumlah || 1;
                    const h = (item.jumlah / maxJml) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.jumlah}</div>
                        <div className="w-full flex justify-center" style={{ height: '120px', alignItems: 'flex-end' }}>
                          <div className={cn('w-full rounded-t-md transition-all', color, hoverColor)} style={{ height: `${h}%` }} title={`${item.jenis}: ${item.jumlah}`} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-1 truncate w-full text-center">{item.jenis}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
