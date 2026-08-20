import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, GraduationCap, BarChart3, Globe, ArrowLeft, Loader2, FlaskConical, FileText, Bookmark, ChevronDown, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicService } from '@/src/services/publicService';
import { cn, openDocument } from '@/src/lib/utils';

interface DokumentasiItem {
  id: string;
  penulis: string;
  coAuthor: string;
  judul: string;
  tanggal: string;
  tahun: string;
  penerbit: string;
  isbnIssn: string;
  platform: string;
  fileUrl: string;
  articleUrl?: string;
}

export default function StatistikPage() {
  const [stats, setStats] = useState<any>(null);
  const [pubByYear, setPubByYear] = useState<any[]>([]);
  const [pubByDosen, setPubByDosen] = useState<any[]>([]);
  const [pubByType, setPubByType] = useState<any[]>([]);
  const [penelitianByYear, setPenelitianByYear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dokumentasi interactive state
  const [activeDocType, setActiveDocType] = useState<string | null>(null);
  const [docItems, setDocItems] = useState<DokumentasiItem[]>([]);
  const [docLoading, setDocLoading] = useState(false);

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

  const handleDocTypeClick = async (type: string) => {
    if (activeDocType === type) {
      setActiveDocType(null);
      setDocItems([]);
      return;
    }
    setDocLoading(true);
    setActiveDocType(type);
    const items = await publicService.getDokumentasiByType(type);
    setDocItems(items);
    setDocLoading(false);
  };

  const docCategories = [
    { label: 'Jurnal', value: stats?.jurnal || 0, color: 'bg-blue-500', hover: 'hover:bg-blue-600', key: 'Jurnal' },
    { label: 'Penelitian', value: stats?.penelitianDoc || 0, color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', key: 'Penelitian' },
    { label: 'Pengabdian', value: stats?.pengabdianDoc || 0, color: 'bg-amber-500', hover: 'hover:bg-amber-600', key: 'Pengabdian' },
    { label: 'Buku', value: stats?.buku || 0, color: 'bg-violet-500', hover: 'hover:bg-violet-600', key: 'Buku' },
    { label: 'Prosiding', value: stats?.prosiding || 0, color: 'bg-rose-500', hover: 'hover:bg-rose-600', key: 'Prosiding' },
    { label: 'Lainnya', value: stats?.lainnya || 0, color: 'bg-slate-500', hover: 'hover:bg-slate-600', key: 'Lainnya' },
  ];

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
                { label: 'Peneliti', value: stats.dosenCount, icon: GraduationCap, color: 'bg-primary/10 text-primary' },
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

            {/* ========== STATISTIK DOKUMENTASI (INTERAKTIF) ========== */}
            <div className="card p-12 bg-white shadow-xl border-none">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center">
                  <FileText className="mr-3 text-primary" /> Statistik Dokumentasi
                </h3>
                <span className="text-xs text-slate-500 font-bold">{stats.dokumentasiTotal || 0} Total</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {docCategories.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleDocTypeClick(item.key)}
                    className={cn(
                      "text-center p-5 rounded-2xl transition-all cursor-pointer group",
                      activeDocType === item.key
                        ? "bg-slate-900 text-white shadow-xl scale-105 ring-2 ring-primary"
                        : "bg-slate-50 hover:bg-slate-100 hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white",
                      activeDocType === item.key ? "bg-primary" : item.color
                    )}>
                      <FileText size={16} />
                    </div>
                    <p className={cn(
                      "text-2xl font-black mb-0.5",
                      activeDocType === item.key ? "text-white" : "text-slate-900"
                    )}>{item.value}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      activeDocType === item.key ? "text-white/70" : "text-slate-500"
                    )}>{item.label}</p>
                    {activeDocType === item.key && (
                      <ChevronDown size={14} className="mx-auto mt-2 text-primary animate-bounce" />
                    )}
                  </button>
                ))}
              </div>

              {/* Detail List */}
              <AnimatePresence>
                {activeDocType && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 border-t border-slate-100 pt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                          Daftar {activeDocType}
                          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px]">{docItems.length} item</span>
                        </h4>
                        <button 
                          onClick={() => { setActiveDocType(null); setDocItems([]); }} 
                          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                        >
                          Tutup
                        </button>
                      </div>

                      {docLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                      ) : docItems.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 italic text-xs">
                          Belum ada data {activeDocType}.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Table Header */}
                          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2">
                            <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Penulis</span>
                            <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cluster / Platform</span>
                            <span className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Judul</span>
                            <span className="col-span-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tahun</span>
                            <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Penerbit</span>
                            <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</span>
                          </div>

                          {docItems.map((item, i) => (
                            <div key={item.id} className="bg-slate-50 rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all">
                              {/* Desktop */}
                              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-2">
                                  <p className="text-xs font-bold text-slate-900 truncate">{item.penulis}</p>
                                </div>
                                <div className="col-span-2">
                                  {item.platform ? (
                                    <span className="inline-flex px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-wider">{item.platform}</span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">-</span>
                                  )}
                                </div>
                                <div className="col-span-3">
                                  <p className="text-xs font-bold text-slate-900 truncate italic" title={item.judul}>{item.judul}</p>
                                </div>
                                <div className="col-span-1">
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black">{item.tahun}</span>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-[10px] text-slate-500 truncate">{item.penerbit}</p>
                                </div>
                                <div className="col-span-2 flex justify-end gap-1.5">
                                  {item.fileUrl ? (
                                    <button 
                                      onClick={() => openDocument(item.fileUrl, `${item.judul || item.penulis}`)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                      <Download size={12} /> Unduh
                                    </button>
                                  ) : (
                                    <span className="text-[9px] font-bold text-slate-400 italic">Tidak ada file</span>
                                  )}
                                  {item.articleUrl ? (
                                    <a 
                                      href={item.articleUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm"
                                    >
                                      <Eye size={12} /> Link
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                              {/* Mobile */}
                              <div className="md:hidden space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="min-w-0 flex-grow">
                                    <p className="text-xs font-bold text-slate-900 truncate">{item.judul}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{item.penulis}</p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black shrink-0 ml-2">{item.tahun}</span>
                                </div>
                                {item.platform && (
                                  <span className="inline-flex px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[9px] font-black">{item.platform}</span>
                                )}
                                <div className="flex justify-between items-center pt-1">
                                  <p className="text-[10px] text-slate-500">{item.penerbit}</p>
                                  <div className="flex gap-1.5">
                                    {item.fileUrl ? (
                                      <button 
                                        onClick={() => openDocument(item.fileUrl, `${item.judul || item.penulis}`)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase"
                                      >
                                        <Download size={10} /> Unduh
                                      </button>
                                    ) : null}
                                    {item.articleUrl ? (
                                      <a 
                                        href={item.articleUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase"
                                      >
                                        <Eye size={10} /> Link
                                      </a>
                                    ) : null}
                                    {!item.fileUrl && !item.articleUrl && (
                                      <span className="text-[9px] text-slate-400 italic">Tidak ada file</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grafik Penelitian Dosen per Tahun — Skema */}
            {penelitianByYear.length > 0 && (
              <div className="card p-12 bg-white shadow-xl border-none">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                  <FlaskConical className="mr-3 text-primary" /> Penelitian Dosen per Tahun Berdasarkan Skema
                </h3>
                <div className="flex items-end gap-3 h-64">
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
                        <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{total}</div>
                        <div className="w-full flex gap-0.5" style={{ height: '180px', alignItems: 'flex-end' }}>
                          {bars.map((bar, bi) => (
                            <div key={bi} className={`flex-1 ${bar.color} rounded-t-lg transition-all ${bar.hover}`} style={{ height: `${(bar.val / maxTotal) * 100}%` }} title={`${bar.label}: ${bar.val}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500 mt-2">{item.tahun}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-blue-500" />Internal</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-emerald-500" />Mandiri</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-amber-400" />Hibah</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded bg-violet-500" />Kerjasama</span>
                </div>
              </div>
            )}

            {pubByYear.length > 0 && (
              <div className="card p-12 bg-white shadow-xl border-none">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                  <BarChart3 className="mr-3 text-primary" /> Publikasi per Tahun Berdasarkan Jenis (Jurnal, Buku, Prosiding, Penelitian)
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

            {/* Grafik Publikasi per Dosen — Full Width */}
            {pubByDosen.length > 0 && (
              <div className="card p-12 bg-white shadow-xl border-none overflow-x-auto">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center mb-8">
                  <GraduationCap className="mr-3 text-primary" /> Publikasi per Dosen
                </h3>
                <div className="flex items-end gap-1 h-64 min-w-[800px]">
                    {pubByDosen.map((item, i) => {
                      const maxTotal = pubByDosen[0]?.total || 1;
                      const bars = [
                        { val: item.penelitian, color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', label: 'Penelitian' },
                        { val: item.jurnal, color: 'bg-blue-500', hover: 'hover:bg-blue-600', label: 'Jurnal' },
                        { val: item.prosiding, color: 'bg-rose-500', hover: 'hover:bg-rose-600', label: 'Prosiding' },
                        { val: item.buku, color: 'bg-violet-500', hover: 'hover:bg-violet-600', label: 'Buku' },
                      ];
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${item.fullName || item.dosenName}: P${item.penelitian} J${item.jurnal} Pr${item.prosiding} B${item.buku}` }>
                          <div className="text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.total}</div>
                          <div className="w-full flex gap-px" style={{ height: '180px', alignItems: 'flex-end' }}>
                            {bars.map((bar, bi) => (
                              <div key={bi} className={`flex-1 ${bar.color} rounded-t-sm transition-all ${bar.hover}`} style={{ height: `${(bar.val / maxTotal) * 100}%` }} title={`${bar.label}: ${bar.val}`} />
                            ))}
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 mt-2 truncate w-full text-center" title={item.fullName || item.dosenName}>{item.dosenName}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-emerald-500" />Penelitian</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-blue-500" />Jurnal</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-rose-500" />Prosiding</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-violet-500" />Buku</span>
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
          </>
        )}
      </div>
    </div>
  );
}
