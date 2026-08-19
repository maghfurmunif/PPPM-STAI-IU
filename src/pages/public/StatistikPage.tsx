import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, BarChart3, Globe, ArrowLeft, Loader2, FlaskConical, FileText, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicService } from '@/src/services/publicService';
import { cn } from '@/src/lib/utils';

export default function StatistikPage() {
  const [stats, setStats] = useState<any>(null);
  const [pubByYear, setPubByYear] = useState<any[]>([]);
  const [pubByDosen, setPubByDosen] = useState<any[]>([]);
  const [pubByType, setPubByType] = useState<any[]>([]);
  const [penelitianByYear, setPenelitianByYear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [statsData, yearData, dosenData, typeData, penYearData] = await Promise.all([
        publicService.getGlobalStats(),
        publicService.getPublicationByYear(),
        publicService.getPublicationByDosen(),
        publicService.getPublicationByType(),
        publicService.getPenelitianByYear()
      ]);
      setStats(statsData);
      setPubByYear(yearData);
      setPubByDosen(dosenData);
      setPubByType(typeData);
      setPenelitianByYear(penYearData);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-16">
        <div className="text-center space-y-4">
           <Link to="/" className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda</span>
           </Link>
           <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Laman Statistik</h1>
           <p className="text-slate-500 font-medium text-lg">Visualisasi data realtime manajemen akademik PPPM STAI Ihyaul Ulum.</p>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 italic text-slate-500 font-bold uppercase tracking-widest text-xs space-y-4">
               <Loader2 className="animate-spin text-primary" size={40} />
               <p>Mengkalkulasi Data Sistem...</p>
            </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Mahasiswa', value: stats.mahasiswaCount, icon: Users, color: 'bg-blue-50 text-blue-500' },
                { label: 'Dosen Pembimbing', value: stats.dosenCount, icon: GraduationCap, color: 'bg-primary/10 text-primary' },
                { label: 'Penelitian Dosen', value: stats.penelitian, icon: FlaskConical, color: 'bg-rose-50 text-rose-500' },
                { label: 'Proyek KKN', value: stats.kkn, icon: Globe, color: 'bg-indigo-50 text-indigo-500' }
              ].map((item, i) => (
                <div key={i} className="card p-10 bg-white shadow-xl border-none flex flex-col items-center space-y-6 text-center group">
                   <div className={`w-16 h-16 ${item.color} rounded-[28px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                      <item.icon size={30} />
                   </div>
                   <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">{item.value}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="card p-12 bg-white shadow-2xl border-none space-y-10">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center tracking-tight">
                     <BarChart3 className="mr-3 text-primary" /> Rincian Aktivitas
                  </h3>
                  <div className="space-y-8">
                     {[
                       { label: 'Kuliah Kerja Nyata (KKN)', total: stats.kkn, progress: 'w-[85%]', color: 'bg-indigo-500' },
                       { label: 'Seminar Proposal (Sempro)', total: stats.sempro, progress: 'w-[70%]', color: 'bg-blue-500' },
                       { label: 'Skripsi Mahasiswa', total: stats.skripsi, progress: 'w-[92%]', color: 'bg-emerald-500' },
                       { label: 'Penelitian Dosen', total: stats.penelitian, progress: 'w-[65%]', color: 'bg-rose-500' }
                     ].map((row, i) => (
                       <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-black uppercase tracking-widest text-slate-500">{row.label}</span>
                             <span className="text-xl font-black text-slate-900 italic">{row.total}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(row.total / (stats.totalActivity || 1)) * 100}%` }}
                               className={`h-full ${row.color}`} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="card p-12 !bg-slate-900 shadow-2xl border-none text-white overflow-hidden relative">
                  <div className="relative z-10 space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Academic Transparency</div>
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Integritas Data</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Seluruh data yang ditampilkan bersifat realtime dan diambil langsung dari database terpusat STAI Ihyaul Ulum. Kami menjamin transparansi pelaporan akademik guna mendukung mutu pendidikan yang lebih baik.</p>
                     <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <p className="text-3xl font-black italic tracking-tighter mb-1 text-primary">{stats.totalActivity}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Record</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <p className="text-3xl font-black italic tracking-tighter mb-1 text-primary">{stats.activeUsers}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">User Aktif</p>
                        </div>
                     </div>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/2 translate-y-1/2">
                     <Globe size={400} />
                  </div>
               </div>
            </div>

            {/* Statistik Dokumentasi */}
            <div className="card p-12 bg-white shadow-xl border-none">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center">
                  <FileText className="mr-3 text-primary" /> Statistik Dokumentasi
                </h3>
                <span className="text-xs text-slate-500 font-bold">{stats.dokumentasiTotal || 0} Total</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { label: 'Jurnal', value: stats.jurnal || 0, color: 'bg-blue-500' },
                  { label: 'Penelitian', value: stats.penelitianDoc || 0, color: 'bg-emerald-500' },
                  { label: 'Pengabdian', value: stats.pengabdianDoc || 0, color: 'bg-amber-500' },
                  { label: 'Buku', value: stats.buku || 0, color: 'bg-violet-500' },
                  { label: 'Prosiding', value: stats.prosiding || 0, color: 'bg-rose-500' },
                  { label: 'Lainnya', value: stats.lainnya || 0, color: 'bg-slate-500' }
                ].map((item, i) => (
                  <div key={i} className="text-center p-5 rounded-2xl bg-slate-50">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white", item.color)}>
                      <FileText size={16} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-0.5">{item.value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grafik Publikasi per Tahun */}
            {/* Grafik Penelitian Dosen per Tahun */}
            {penelitianByYear.length > 0 && (
              <div className="card p-12 bg-white shadow-xl border-none">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                  <FlaskConical className="mr-3 text-primary" /> Penelitian Dosen per Tahun
                </h3>
                <div className="flex items-end gap-3 h-64">
                  {penelitianByYear.map((item, i) => {
                    const total = item.selesai + item.aktif;
                    const maxTotal = Math.max(...penelitianByYear.map((y: any) => y.selesai + y.aktif), 1);
                    const hSelesai = (item.selesai / maxTotal) * 100;
                    const hAktif = (item.aktif / maxTotal) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{total}</div>
                        <div className="w-full flex gap-1" style={{ height: '180px', alignItems: 'flex-end' }}>
                          <div className="flex-1 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" style={{ height: `${hSelesai}%` }} title={`Selesai: ${item.selesai}`} />
                          <div className="flex-1 bg-amber-400 rounded-t-lg transition-all hover:bg-amber-500" style={{ height: `${hAktif}%` }} title={`Aktif: ${item.aktif}`} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 mt-2">{item.tahun}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-emerald-500" />Selesai</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-amber-400" />Aktif</span>
                </div>
              </div>
            )}

            {pubByYear.length > 0 && (
              <div className="card p-12 bg-white shadow-xl border-none">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                  <BarChart3 className="mr-3 text-primary" /> Publikasi per Tahun
                </h3>
                <div className="flex items-end gap-3 h-64">
                  {pubByYear.map((item, i) => {
                    const total = item.jurnal + item.buku + item.prosiding + item.penelitian;
                    const maxTotal = Math.max(...pubByYear.map((y: any) => y.jurnal + y.buku + y.prosiding + y.penelitian), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{total}</div>
                        <div className="w-full flex gap-0.5" style={{ height: '180px', alignItems: 'flex-end' }}>
                          <div className="flex-1 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${(item.jurnal / maxTotal) * 100}%` }} title={`Jurnal: ${item.jurnal}`} />
                          <div className="flex-1 bg-violet-500 rounded-t-lg transition-all hover:bg-violet-600" style={{ height: `${(item.buku / maxTotal) * 100}%` }} title={`Buku: ${item.buku}`} />
                          <div className="flex-1 bg-rose-500 rounded-t-lg transition-all hover:bg-rose-600" style={{ height: `${(item.prosiding / maxTotal) * 100}%` }} title={`Prosiding: ${item.prosiding}`} />
                          <div className="flex-1 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" style={{ height: `${(item.penelitian / maxTotal) * 100}%` }} title={`Penelitian: ${item.penelitian}`} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 mt-2">{item.tahun}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-blue-500" />Jurnal</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-violet-500" />Buku</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-rose-500" />Prosiding</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-emerald-500" />Penelitian</span>
                </div>
              </div>
            )}

            {/* Grafik Publikasi per Dosen & Jenis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {pubByDosen.length > 0 && (
                <div className="card p-12 bg-white shadow-xl border-none">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                    <GraduationCap className="mr-3 text-primary" /> Publikasi per Dosen
                  </h3>
                  <div className="flex items-end gap-2 h-64">
                    {pubByDosen.map((item, i) => {
                      const maxTotal = pubByDosen[0]?.total || 1;
                      const h = (item.total / maxTotal) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.total}</div>
                          <div className="w-full flex justify-center" style={{ height: '180px', alignItems: 'flex-end' }}>
                            <div className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80" style={{ height: `${h}%` }} title={`${item.dosenName}: ${item.total}`} />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 mt-2 truncate w-full text-center" title={item.dosenName}>{item.dosenName.split(' ').pop()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pubByType.length > 0 && (
                <div className="card p-12 bg-white shadow-xl border-none">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                    <FileText className="mr-3 text-primary" /> Jenis Publikasi
                  </h3>
                  <div className="flex items-end gap-4 h-64">
                    {pubByType.map((item, i) => {
                      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];
                      const hoverColors = ['hover:bg-blue-600', 'hover:bg-emerald-600', 'hover:bg-violet-600', 'hover:bg-amber-600', 'hover:bg-rose-600', 'hover:bg-slate-600'];
                      const color = colors[i % colors.length];
                      const hoverColor = hoverColors[i % hoverColors.length];
                      const maxJml = pubByType[0]?.jumlah || 1;
                      const h = (item.jumlah / maxJml) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.jumlah}</div>
                          <div className="w-full flex justify-center" style={{ height: '180px', alignItems: 'flex-end' }}>
                            <div className={cn('w-full rounded-t-lg transition-all', color, hoverColor)} style={{ height: `${h}%` }} title={`${item.jenis}: ${item.jumlah}`} />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 mt-2 truncate w-full text-center">{item.jenis}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
