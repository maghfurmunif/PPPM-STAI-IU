import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Plus, Filter, 
  ExternalLink, Download, Clock, Loader2,
  Trash2, Globe, Archive, Hash, Calendar,
  Activity, GraduationCap, FlaskConical, HeartHandshake, User
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { penelitianService, DosenDokumentasi } from '@/src/services/penelitianService';

export default function AdminDokumentasi() {
  const [docs, setDocs] = useState<DosenDokumentasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const data = await penelitianService.getDokumentasi();
      setDocs(data);
    } catch (e) {
      toast.error('Gagal memuat arsip dokumentasi');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await penelitianService.deleteDokumentasi(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast.success('Dokumentasi berhasil dihapus dari database');
    } catch (e) {
      toast.error('Gagal menghapus dokumentasi');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const filtered = docs.filter(d => {
    const matchesSearch = (d.judul.toLowerCase().includes(search.toLowerCase()) || 
                          d.jenisKarya.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filterType === 'ALL' || d.jenisKarya === filterType;
    return matchesSearch && matchesFilter;
  });

  const types = ['ALL', ...new Set(docs.map(d => d.jenisKarya))];

  if (loading && docs.length === 0) return (
     <div className="flex flex-col items-center justify-center py-20 italic text-slate-500 font-bold uppercase tracking-widest text-xs space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p>Indexing Digital Asset Repository...</p>
     </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-0.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Institutional Asset Vault</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase italic underline decoration-primary/30 underline-offset-8">Repository Dokumentasi</h1>
          <p className="text-slate-500 font-medium pt-2">Sentralisasi data luaran penelitian dan pengabdian dosen serta karya akademik.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Archive..." 
                className="input-field pl-12 py-4 w-64 text-xs font-black uppercase tracking-widest shadow-sm bg-white" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 side-scrollbar snap-x">
         {types.map(t => (
            <button 
              key={t} 
              onClick={() => setFilterType(t)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border snap-start",
                filterType === t ? "bg-slate-900 text-white shadow-xl border-slate-900 scale-105" : "bg-white text-slate-500 border-slate-100 hover:border-primary/40 hover:text-primary"
              )}
            >
              {t}
            </button>
         ))}
      </div>

      <div className="card overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[40px] bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em]">
            <tr>
              <th className="px-10 py-7">Classification</th>
              <th className="px-10 py-7">Title & Metadata</th>
              <th className="px-10 py-7">Nama Peneliti</th>
              <th className="px-10 py-7">Platform / Sync</th>
              <th className="px-10 py-7 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-32 text-center text-slate-500 italic font-black uppercase tracking-widest text-[11px] bg-slate-50/50 border-dashed border-2 m-4 rounded-[32px]">
                   Search query returned no archived assets.
                </td>
              </tr>
            ) : (
              filtered.map((doc, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={doc.id} 
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="px-10 py-8">
                     <div className="flex flex-col space-y-2">
                        <span className={cn(
                           "inline-flex w-fit px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-sm border",
                           doc.jenisKarya.includes('Penelitian') ? "bg-orange-50 text-orange-600 border-orange-100" : 
                           doc.jenisKarya.includes('Pengabdian') ? "bg-primary/10 text-primary border-primary/20" :
                           "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {doc.jenisKarya}
                        </span>
                        <div className="flex items-center space-x-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                           {doc.jenisKarya.includes('Penelitian') ? <FlaskConical size={12} /> : <HeartHandshake size={12} />}
                           <span>Resource Module</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8 max-w-lg">
                     <p className="font-black text-slate-900 text-lg leading-tight mb-2 tracking-tight uppercase italic group-hover:text-primary transition-colors">{doc.judul}</p>
                     {doc.penulisTambahan && (
                       <p className="text-[10px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                         <User size={12} className="text-primary" />
                         <span>Co-Authors: {doc.penulisTambahan}</span>
                       </p>
                     )}
                     <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <Calendar size={12} className="text-primary" />
                           <span>Archived {doc.tanggal}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <Hash size={12} className="text-primary" />
                           <span>REF-{doc.id.slice(0, 8)}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 italic">{doc.namaPeneliti || '-'}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                       <Activity size={14} className="text-green-500 animate-pulse" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{doc.platform}{doc.platformRank ? ` ${doc.platformRank}` : ''}</span>
                    </div>
                  </td>
                   <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.fileUrl ? (
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 bg-primary/10 border border-primary/20 rounded-[20px] text-primary hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm hover:shadow-xl"
                          title="Download / Lihat File"
                        >
                          <Download size={20} />
                        </a>
                      ) : (
                        <span className="p-4 bg-slate-50 border border-slate-100 rounded-[20px] text-slate-300" title="Belum ada file">
                          <Download size={20} />
                        </span>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm(doc.id)}
                        className="p-4 bg-red-50 border border-red-100 rounded-[20px] text-red-400 hover:text-red-600 hover:bg-red-100 hover:scale-110 active:scale-95 transition-all shadow-sm"
                        title="Hapus dokumentasi"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-10 bg-slate-50 text-slate-900 border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform"><Archive size={120} /></div>
            <h4 className="text-4xl font-black italic tracking-tighter text-white mb-2">{docs.length}</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Total Archived Assets</p>
         </div>
         <div className="card p-10 bg-white shadow-xl border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform"><Globe size={120} className="text-primary" /></div>
            <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2">99.8%</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Institutional Sync Index</p>
         </div>
         <div className="card p-10 bg-white shadow-xl border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform"><Activity size={120} className="text-primary" /></div>
            <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2">ACTIVE</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Repository Health Status</p>
         </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-10 max-w-md mx-4 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Hapus Dokumentasi?</h3>
                  <p className="text-xs text-slate-500 font-medium">Data akan dihapus permanen dari database Supabase.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Dokumentasi ini akan <span className="font-black text-red-600">dihapus permanen</span> dari repository.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                  disabled={deletingId !== null}
                  className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deletingId ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                  <span>{deletingId ? 'Menghapus...' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

