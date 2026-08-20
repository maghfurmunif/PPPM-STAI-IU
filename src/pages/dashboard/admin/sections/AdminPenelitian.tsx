import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, CheckCircle2, XCircle, Eye, 
  Search, Calendar, Clock, FileText, Save,
  MapPin, User, Users, ClipboardList, BookOpen,
  ArrowRight, MessageSquare, AlertCircle, Loader2, FileUp,
  Plus, Edit3, Camera, Download, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatDate, openDocument } from '@/src/lib/utils';
import { penelitianService, PenelitianRegistration } from '@/src/services/penelitianService';
import StatusBadge from '@/src/components/ui/StatusBadge';
import PenelitianCompleteHistory from '@/src/components/dashboard/PenelitianCompleteHistory';

export default function AdminPenelitian() {
  const [registrations, setRegistrations] = useState<PenelitianRegistration[]>([]);
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<PenelitianRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dosenProfiles, setDosenProfiles] = useState<{ id: string; fullName: string }[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const refreshData = async (quiet = false) => {
    if (!quiet) setLoading(true);
    const data = await penelitianService.getRegistrations();
    setRegistrations(data);
    if (selectedReg) {
      setSelectedReg(data.find(r => r.id === selectedReg.id) || null);
    }
    const profiles = await penelitianService.getDosenProfiles();
    setDosenProfiles(profiles);
    if (!quiet) setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filtered = registrations.filter(r => 
    r.dosenName?.toLowerCase().includes(search.toLowerCase()) ||
    r.judulPenelitian?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await penelitianService.deleteRegistration(id);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      if (selectedReg?.id === id) {
        setSelectedReg(null);
      }
      toast.success('Penelitian berhasil dihapus dari database');
    } catch (e) {
      toast.error('Gagal menghapus penelitian');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleCreateEntry = async (dosenId: string, judul: string, skema: string, coAuthors: string, tahun: string, jenisKarya: string) => {
    try {
      const dosen = dosenProfiles.find(p => p.id === dosenId);
      const newReg: PenelitianRegistration = {
        id: crypto.randomUUID(),
        dosenId,
        dosenName: dosen?.fullName || 'Dosen',
        status: 'ENROLL',
        logbooks: [],
        judulPenelitian: judul,
        coAuthors,
        skema: skema as any,
        tahunPenelitian: tahun,
        jenisKarya,
      };
      await penelitianService.saveRegistration(newReg);
      toast.success('Data penelitian baru berhasil dibuat');
      setShowCreateModal(false);
      await refreshData(true);
      setSelectedReg(newReg);
    } catch (e) {
      toast.error('Gagal membuat data penelitian');
    }
  };

  if (loading && registrations.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Penelitian...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-primary underline-offset-8">Manajemen Penelitian</h1>
          <p className="text-slate-500 font-medium mt-2 text-xs">Kelola proposal, seminar, dan publikasi penelitian dosen.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest"
          >
            <Plus size={16} />
            <span>Tambah Manual</span>
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari dosen / judul..." 
              className="input-field pl-12 py-3 w-64 text-xs font-bold uppercase tracking-widest shadow-sm" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto side-scrollbar pr-2">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center space-y-3 border-dashed">
               <FlaskConical className="mx-auto text-slate-200" size={40} />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Belum ada pengajuan</p>
            </div>
          ) : (
            filtered.map(reg => (
              <div 
                key={reg.id} 
                onClick={() => setSelectedReg(reg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedReg(reg); }}
                className={cn(
                  "w-full card p-5 text-left transition-all border-l-[6px] group cursor-pointer",
                  selectedReg?.id === reg.id ? "border-l-primary shadow-xl scale-[1.02] bg-white" : "border-l-slate-200 hover:border-l-slate-400"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                   <StatusBadge status={reg.status} />
                   <span className="text-[9px] font-bold text-slate-500 italic">#{reg.id.slice(0, 5)}</span>
                </div>
                <div className="flex items-center justify-between">
                   <h4 className="font-bold text-slate-900 truncate group-hover:text-primary">{reg.dosenName}</h4>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setShowDeleteConfirm(reg.id);
                     }}
                     className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                     title="Hapus penelitian"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
                {reg.jenisKarya && (
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black uppercase rounded-full mt-1">{reg.jenisKarya}</span>
                )}
                {reg.judulPenelitian && (
                  <p className="text-[9px] text-slate-500 truncate mt-1 italic">{reg.judulPenelitian}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
          {selectedReg ? (
            <motion.div 
              key={selectedReg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="card bg-slate-50 text-slate-900 p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FlaskConical size={120} />
                 </div>
                 <div className="relative z-10 flex justify-between items-start">
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Researcher Profile</p>
                       <h2 className="text-3xl font-black italic tracking-tighter uppercase">{selectedReg.dosenName}</h2>
                       <p className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-widest">ID: {selectedReg.dosenId}</p>
                    </div>
                    <StatusBadge status={selectedReg.status} />
                 </div>
              </div>

              {/* Metadata Penelitian */}
              <MetadataEditor 
                registration={selectedReg} 
                onSaved={async () => {
                  await refreshData(true);
                }} 
              />

              {/* Action Phases */}
              {selectedReg.status === 'SUBMITTED' && (
                <ProposalAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {selectedReg.status === 'SEMPRO_SUBMITTED' && (
                <SemproProofAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {(selectedReg.status === 'PROGRESS' || selectedReg.status === 'APPROVED' || selectedReg.status === 'SEMPRO_SUBMITTED') && (
                <LogbookAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {selectedReg.status === 'PROGRESS' && selectedReg.logbooks.filter(l => l.status === 'APPROVED').length >= 5 && (
                <div className="card p-8 bg-green-50 border-green-100 text-center space-y-4">
                   <CheckCircle2 size={48} className="text-green-500 mx-auto" />
                   <h3 className="text-xl font-bold text-green-900 italic">Kuota Logbook Terpenuhi</h3>
                   <p className="text-sm text-green-700">Dosen kini dapat mengunggah Hasil Penelitian.</p>
                </div>
              )}

              {selectedReg.status === 'RESULT_SUBMITTED' && (
                <ResultAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {selectedReg.status === 'RESULT_APPROVED' && (
                <FinalSemproProofAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {selectedReg.status === 'REVISION_SUBMITTED' && (
                <RevisionAction reg={selectedReg} onAction={() => refreshData(true)} />
              )}

              {selectedReg.status === 'PUBLICATION' && (
                <div className="card p-10 text-center space-y-4 bg-slate-50">
                   <BookOpen size={48} className="text-primary mx-auto" />
                   <h3 className="text-xl font-bold italic">Menunggu Dosen Memilih Publikasi</h3>
                   <p className="text-sm text-slate-500 max-w-sm mx-auto">Admin akan mendapat kabar setelah dosen menentukan metode publikasi (Mandiri / via PPPM).</p>
                </div>
              )}

              {selectedReg.status === 'COMPLETED' && (
                <div className="space-y-10">
                  <div className="card p-12 text-center space-y-6 bg-slate-50 text-slate-900 relative overflow-hidden rounded-[40px] shadow-2xl">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><FlaskConical size={120} /></div>
                     <CheckCircle2 size={64} className="text-primary mx-auto" />
                     <div>
                       <h2 className="text-3xl font-black italic uppercase tracking-tighter">Penelitian Selesai</h2>
                       <p className="text-slate-500 mt-2 font-medium">Seluruh tahapan telah dilalui. Terima kasih atas dedikasi dosen.</p>
                     </div>
                     {selectedReg.publication && (
                       <div className="pt-6 border-t border-white/10 text-left">
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Metode Publikasi</p>
                          <div className="flex items-center space-x-3 text-sm font-bold">
                             <BookOpen size={16} />
                             <span>{selectedReg.publication.method || 'PUBLIKASI MANDIRI'}</span>
                          </div>
                       </div>
                     )}
                  </div>
                  <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-3xl">
                     <PenelitianCompleteHistory registration={selectedReg} />
                  </div>
                </div>
              )}

              {/* Status Log */}
              <div className="card p-8 bg-slate-50 border-none">
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">Informasi Proyek</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase">Proposal</p>
                       {selectedReg.proposalFile ? (
                         <button onClick={() => openDocument(selectedReg.proposalFile, `Proposal_Penelitian_${selectedReg.dosenName || 'Dosen'}`)} className="flex items-center space-x-2 text-primary text-xs font-bold hover:underline">
                            <FileText size={14} />
                            <span>Buka Proposal</span>
                         </button>
                       ) : <span className="text-xs font-bold text-slate-500 italic">Belum diunggah</span>}
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase">SK Reviuwer</p>
                       {selectedReg.skReviewerFile ? (
                         <button onClick={() => openDocument(selectedReg.skReviewerFile, `SK_Reviewer_${selectedReg.dosenName || 'Dosen'}`)} className="flex items-center space-x-2 text-primary text-xs font-bold hover:underline">
                            <FileText size={14} />
                            <span>Buka SK Reviuwer</span>
                         </button>
                       ) : <span className="text-xs font-bold text-slate-500 italic">Belum diunggah</span>}
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase">SK Penerima Bantuan</p>
                       {selectedReg.skPenerimaBantuanFile ? (
                         <button onClick={() => openDocument(selectedReg.skPenerimaBantuanFile, `SK_Penerima_Bantuan_${selectedReg.dosenName || 'Dosen'}`)} className="flex items-center space-x-2 text-primary text-xs font-bold hover:underline">
                            <FileText size={14} />
                            <span>Buka SK Penerima Bantuan</span>
                         </button>
                       ) : <span className="text-xs font-bold text-slate-500 italic">Belum diunggah</span>}
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase">Hasil Akhir</p>
                       {selectedReg.resultFile ? (
                         <button onClick={() => openDocument(selectedReg.resultFile, `Laporan_Hasil_${selectedReg.dosenName || 'Dosen'}`)} className="flex items-center space-x-2 text-primary text-xs font-bold hover:underline">
                            <FileText size={14} />
                            <span>Buka Hasil</span>
                         </button>
                       ) : <span className="text-xs font-bold text-slate-500 italic">Belum diunggah</span>}
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="card h-[400px] flex flex-col items-center justify-center text-center p-20 border-dashed"
            >
               <FlaskConical size={64} className="text-slate-100 mb-4" />
               <h3 className="text-xl font-bold text-slate-500 uppercase italic tracking-widest">Pilih pengajuan penelitian</h3>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEntryModal 
            dosenProfiles={dosenProfiles}
            onSubmit={handleCreateEntry}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>

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
                  <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Hapus Penelitian?</h3>
                  <p className="text-xs text-slate-500 font-medium">Data akan dihapus permanen dari database Supabase.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Proyek penelitian ini beserta seluruh data logbook, dokumentasi, dan berkas terkait akan <span className="font-black text-red-600">dihapus permanen</span>.
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

// =========================================================
// Metadata Editor: Inline edit judul, co-authors, skema
// =========================================================
function MetadataEditor({ registration, onSaved }: { registration: PenelitianRegistration; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    judulPenelitian: registration.judulPenelitian || '',
    coAuthors: registration.coAuthors || '',
    skema: registration.skema || '',
    tahunPenelitian: registration.tahunPenelitian || '',
    jenisKarya: registration.jenisKarya || 'Penelitian',
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = { ...registration, ...form, skema: form.skema as any };
      await penelitianService.saveRegistration(updated);
      toast.success('Metadata penelitian berhasil disimpan');
      setEditing(false);
      onSaved();
    } catch (e) {
      toast.error('Gagal menyimpan metadata');
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="card p-6 bg-white border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Metadata Penelitian</h4>
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase hover:underline">
            <Edit3 size={12} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Judul</span>
            <p className="font-bold text-slate-700 italic">{registration.judulPenelitian || '-'}</p>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Co-Author</span>
            <p className="font-bold text-slate-700">{registration.coAuthors || '-'}</p>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Jenis Karya</span>
            <p className="font-bold text-slate-700">{registration.jenisKarya || 'Penelitian'}</p>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Skema</span>
            <p className="font-bold text-slate-700">{registration.skema || '-'}</p>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Tahun</span>
            <p className="font-bold text-slate-700">{registration.tahunPenelitian || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-primary/5 border border-primary/10 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">Edit Metadata Penelitian</h4>
        <button onClick={() => setEditing(false)} className="text-[10px] font-black text-slate-500 uppercase hover:text-slate-700">Batal</button>
      </div>
      <div>
        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Judul Penelitian</label>
        <input 
          className="input-field w-full text-xs" 
          value={form.judulPenelitian}
          onChange={e => setForm(p => ({ ...p, judulPenelitian: e.target.value }))}
          placeholder="Masukkan judul penelitian..."
        />
      </div>
      <div>
        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Co-Author</label>
        <input 
          className="input-field w-full text-xs" 
          value={form.coAuthors}
          onChange={e => setForm(p => ({ ...p, coAuthors: e.target.value }))}
          placeholder="Nama co-author (pisahkan koma)"
        />
      </div>
      <div>
        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Jenis Karya</label>
        <select 
          className="input-field w-full text-xs"
          value={form.jenisKarya}
          onChange={e => setForm(p => ({ ...p, jenisKarya: e.target.value }))}
        >
          <option value="Penelitian">Penelitian</option>
          <option value="Jurnal">Jurnal</option>
          <option value="Buku">Buku</option>
          <option value="Pengabdian">Pengabdian</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Skema</label>
          <select 
            className="input-field w-full text-xs"
            value={form.skema}
            onChange={e => setForm(p => ({ ...p, skema: e.target.value }))}
          >
            <option value="">- Pilih -</option>
            <option value="INTERNAL">Internal</option>
            <option value="HIBAH">Hibah</option>
            <option value="KERJASAMA">Kerjasama</option>
            <option value="MANDIRI">Mandiri</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Tahun</label>
          <input 
            className="input-field w-full text-xs" 
            value={form.tahunPenelitian}
            onChange={e => setForm(p => ({ ...p, tahunPenelitian: e.target.value }))}
            placeholder="2024"
          />
        </div>
      </div>
      <button 
        onClick={handleSave} 
        disabled={saving}
        className="btn-primary w-full h-10 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
      >
        {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
        Simpan Metadata
      </button>
    </div>
  );
}

// =========================================================
// Create Entry Modal: Admin can manually create penelitian entry
// =========================================================
function CreateEntryModal({ dosenProfiles, onSubmit, onClose }: {
  dosenProfiles: { id: string; fullName: string }[];
  onSubmit: (dosenId: string, judul: string, skema: string, coAuthors: string, tahun: string, jenisKarya: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    dosenId: dosenProfiles[0]?.id || '',
    judulPenelitian: '',
    coAuthors: '',
    skema: '',
    tahunPenelitian: new Date().getFullYear().toString(),
    jenisKarya: 'Penelitian',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Tambah Data Penelitian</h3>
          <p className="text-xs text-slate-500 mt-1">Buat entri manual untuk penelitian pra-2025 atau data yang belum tercatat di sistem.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Peneliti Utama (Dosen)</label>
            <select 
              className="input-field w-full text-xs" 
              value={form.dosenId}
              onChange={e => setForm(p => ({ ...p, dosenId: e.target.value }))}
            >
              <option value="">- Pilih Dosen -</option>
              {dosenProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Judul Penelitian</label>
            <input 
              type="text" 
              className="input-field w-full text-xs" 
              placeholder="Masukkan judul penelitian..."
              value={form.judulPenelitian}
              onChange={e => setForm(p => ({ ...p, judulPenelitian: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Co-Author</label>
            <input 
              type="text" 
              className="input-field w-full text-xs" 
              placeholder="Nama co-author (pisahkan koma jika lebih dari satu)"
              value={form.coAuthors}
              onChange={e => setForm(p => ({ ...p, coAuthors: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Jenis Karya</label>
            <select 
              className="input-field w-full text-xs"
              value={form.jenisKarya}
              onChange={e => setForm(p => ({ ...p, jenisKarya: e.target.value }))}
            >
              <option value="Penelitian">Penelitian</option>
              <option value="Jurnal">Jurnal</option>
              <option value="Buku">Buku</option>
              <option value="Pengabdian">Pengabdian</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Skema</label>
              <select 
                className="input-field w-full text-xs"
                value={form.skema}
                onChange={e => setForm(p => ({ ...p, skema: e.target.value }))}
              >
                <option value="">- Pilih Skema -</option>
                <option value="INTERNAL">Internal</option>
                <option value="HIBAH">Hibah</option>
                <option value="KERJASAMA">Kerjasama</option>
                <option value="MANDIRI">Mandiri</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Tahun Penelitian</label>
              <input 
                type="text" 
                className="input-field w-full text-xs" 
                placeholder="2024"
                value={form.tahunPenelitian}
                onChange={e => setForm(p => ({ ...p, tahunPenelitian: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => onSubmit(form.dosenId, form.judulPenelitian, form.skema, form.coAuthors, form.tahunPenelitian, form.jenisKarya)}
            disabled={!form.dosenId}
            className="btn-primary flex-grow h-12 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <Plus size={14} />
            Buat Entri Penelitian
          </button>
          <button 
            onClick={onClose} 
            className="px-6 h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =========================================================
// Existing sub-components (ProposalAction, SemproProofAction, etc.)
// =========================================================
function ProposalAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [uploadingSK, setUploadingSK] = useState(false);
  const [info, setInfo] = useState({
     lokasi: 'Auditorium Lt. 2',
     tanggal: '',
     pukul: '10:00',
     catatan: ''
  });

  const handleUploadSK = async (file: File) => {
    try {
      setUploadingSK(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      const updated = { ...reg, skReviewerFile: url };
      await penelitianService.saveRegistration(updated);
      toast.success('SK Reviuwer berhasil diunggah');
      onAction();
    } catch (e) {
      toast.error('Gagal mengunggah SK Reviuwer');
    } finally {
      setUploadingSK(false);
    }
  };

  const handleApprove = async () => {
    if (!info.tanggal) return alert('Silakan isi tanggal seminar!');
    const updated = {
      ...reg,
      status: 'APPROVED' as any,
      semproInfo: info
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  const handleReject = async () => {
    if (!reason) return alert('Silakan isi alasan penolakan!');
    const updated = {
      ...reg,
      status: 'REJECTED' as any,
      rejectionReason: reason
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  return (
    <div className="card p-8 space-y-8">
       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 italic">Review Proposal Penelitian</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">Pending Review</span>
       </div>

       <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">SK Reviuwer</p>
             {reg.skReviewerFile && (
               <span className="text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">✓ Terunggah</span>
             )}
          </div>
          <label className={cn(
             "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group",
             reg.skReviewerFile ? "border-green-200 bg-green-50/50" : "border-slate-200 hover:border-primary/40 hover:bg-white"
          )}>
             <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => e.target.files?.[0] && handleUploadSK(e.target.files[0])} disabled={uploadingSK} />
             {uploadingSK ? (
               <Loader2 size={24} className="animate-spin text-primary" />
             ) : reg.skReviewerFile ? (
               <div className="flex items-center space-x-3">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="text-xs font-bold text-green-700">SK Reviuwer siap. Klik untuk ganti.</span>
               </div>
             ) : (
               <div className="flex items-center space-x-3 text-slate-500 group-hover:text-primary transition-colors">
                  <FileUp size={20} />
                  <span className="text-xs font-bold">Unggah SK Reviuwer (.pdf / .jpg)</span>
               </div>
             )}
          </label>
       </div>

       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Penjadwalan Seminar Proposal</p>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[9px] font-bold text-slate-500 block mb-1">Tanggal</label>
                <input type="date" className="input-field text-xs" value={info.tanggal} onChange={e => setInfo({...info, tanggal: e.target.value})} />
             </div>
             <div>
                <label className="text-[9px] font-bold text-slate-500 block mb-1">Waktu (WIB)</label>
                <input type="time" className="input-field text-xs" value={info.pukul} onChange={e => setInfo({...info, pukul: e.target.value})} />
             </div>
          </div>
          <input placeholder="Lokasi Seminar" className="input-field text-xs" value={info.lokasi} onChange={e => setInfo({...info, lokasi: e.target.value})} />
          <textarea placeholder="Catatan Tambahan (Opsional)" className="input-field text-xs h-20" value={info.catatan} onChange={e => setInfo({...info, catatan: e.target.value})} />
       </div>

       <div className="flex gap-4">
          {!showReject ? (
            <>
              <button onClick={handleApprove} className="btn-primary flex-grow h-14 uppercase tracking-widest text-[10px]">Terima & Jadwalkan</button>
              <button onClick={() => setShowReject(true)} className="btn-primary bg-red-600 flex-grow h-14 uppercase tracking-widest text-[10px]">Tolak Proposal</button>
            </>
          ) : (
            <div className="w-full space-y-4">
               <textarea placeholder="Alasan penolakan..." className="input-field h-24 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
               <div className="flex gap-4">
                 <button onClick={handleReject} className="btn-primary bg-red-600 flex-grow h-12 uppercase tracking-widest text-[10px]">Konfirmasi Tolak</button>
                 <button onClick={() => setShowReject(false)} className="btn-primary bg-slate-200 text-slate-900 flex-grow h-12 uppercase tracking-widest text-[10px]">Batal</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

function SemproProofAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [uploadingSK, setUploadingSK] = useState(false);

  const handleUploadSK = async (file: File) => {
    try {
      setUploadingSK(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      const updated = { ...reg, skPenerimaBantuanFile: url };
      await penelitianService.saveRegistration(updated);
      toast.success('SK Penerima Bantuan berhasil diunggah');
      onAction();
    } catch (e) {
      toast.error('Gagal mengunggah SK Penerima Bantuan');
    } finally {
      setUploadingSK(false);
    }
  };

  const handleApprove = async () => {
    const updated = { ...reg, status: 'PROGRESS' as any };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  const handleReject = async () => {
    if (!reason) return alert('Silakan isi alasan penolakan!');
    const updated = {
      ...reg,
      status: 'REJECTED' as any,
      rejectionReason: reason
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  return (
    <div className="card p-8 space-y-8">
       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 italic">Bukti Seminar Proposal</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">Pending Review</span>
       </div>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(reg.semproProof?.dokumentasi || []).map((url, i) => (
            <a key={i} href={url} target="_blank" className="aspect-square rounded-xl overflow-hidden border border-slate-100 group relative">
               <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="text-white" size={16} />
               </div>
            </a>
          ))}
          {reg.semproProof?.catatan && (
            <a href={reg.semproProof.catatan} target="_blank" className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-4">
               <FileText className="text-primary mb-2" size={24} />
               <span className="text-[9px] font-black text-primary uppercase text-center">Catatan Seminar</span>
            </a>
          )}
       </div>

       <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">SK Penerima Bantuan Penelitian</p>
             {reg.skPenerimaBantuanFile && (
               <span className="text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">✓ Terunggah</span>
             )}
          </div>
          <label className={cn(
             "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group",
             reg.skPenerimaBantuanFile ? "border-green-200 bg-green-50/50" : "border-slate-200 hover:border-primary/40 hover:bg-white"
          )}>
             <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => e.target.files?.[0] && handleUploadSK(e.target.files[0])} disabled={uploadingSK} />
             {uploadingSK ? (
               <Loader2 size={24} className="animate-spin text-primary" />
             ) : reg.skPenerimaBantuanFile ? (
               <div className="flex items-center space-x-3">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="text-xs font-bold text-green-700">SK Penerima Bantuan siap. Klik untuk ganti.</span>
               </div>
             ) : (
               <div className="flex items-center space-x-3 text-slate-500 group-hover:text-primary transition-colors">
                  <FileUp size={20} />
                  <span className="text-xs font-bold">Unggah SK Penerima Bantuan (.pdf / .jpg)</span>
               </div>
             )}
          </label>
       </div>

       <div className="flex gap-4">
          {!showReject ? (
            <>
              <button onClick={handleApprove} className="btn-primary flex-grow h-14 uppercase tracking-widest text-[10px]">Setujui Bukti Sempro</button>
              <button onClick={() => setShowReject(true)} className="btn-primary bg-red-600 flex-grow h-14 uppercase tracking-widest text-[10px]">Tolak Bukti</button>
            </>
          ) : (
            <div className="w-full space-y-4">
               <textarea placeholder="Alasan penolakan bukti..." className="input-field h-24 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
               <div className="flex gap-4">
                 <button onClick={handleReject} className="btn-primary bg-red-600 flex-grow h-12 uppercase tracking-widest text-[10px]">Konfirmasi Tolak</button>
                 <button onClick={() => setShowReject(false)} className="btn-primary bg-slate-200 text-slate-900 flex-grow h-12 uppercase tracking-widest text-[10px]">Batal</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

function LogbookAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const handleApproveLog = async (logId: string) => {
    const updatedLogbooks = reg.logbooks.map(l => 
      l.id === logId ? { ...l, status: 'APPROVED' as any } : l
    );
    await penelitianService.saveRegistration({ ...reg, logbooks: updatedLogbooks });
    onAction();
  };

  const handleRejectLog = async (logId: string) => {
    const updatedLogbooks = reg.logbooks.map(l => 
      l.id === logId ? { ...l, status: 'REJECTED' as any } : l
    );
    await penelitianService.saveRegistration({ ...reg, logbooks: updatedLogbooks });
    onAction();
  };

  const pendingLogbooks = reg.logbooks.filter(l => l.status === 'PENDING');

  return (
    <div className="card p-8 bg-slate-50 border-none space-y-6">
       <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Manajemen Logbook ({reg.logbooks.length})</h4>
          <span className="text-[9px] font-bold text-primary italic">{reg.logbooks.filter(l => l.status === 'APPROVED').length} Approved</span>
       </div>

       {pendingLogbooks.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-100">
             <p className="text-xs text-slate-500 italic">Tidak ada logbook baru untuk direview.</p>
          </div>
       ) : (
         <div className="space-y-4">
            {pendingLogbooks.map(log => (
              <div key={log.id} className="card p-6 bg-white space-y-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <h5 className="font-bold text-slate-900">{log.activity}</h5>
                       <p className="text-xs text-slate-500">{log.date} • {log.time}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleApproveLog(log.id)} className="p-2 hover:bg-green-50 text-green-500 rounded-lg transition-colors"><CheckCircle2 size={18} /></button>
                       <button onClick={() => handleRejectLog(log.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><XCircle size={18} /></button>
                    </div>
                 </div>
                 <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{log.note}</p>
                 {log.photo && (
                    <a href={log.photo} target="_blank" className="inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full">Lihat Dokumentasi</a>
                 )}
              </div>
            ))}
         </div>
       )}
    </div>
  );
}

function ResultAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [info, setInfo] = useState({
     tanggal: '',
     pukul: '10:00',
     lokasi: 'Ruang Seminar Utama',
     panelis: '',
     peserta: 'Umum & Mahasiswa',
     infoLain: ''
  });

  const handleApprove = async () => {
    if (!info.tanggal || !info.panelis) return alert('Silakan isi tanggal dan panelis!');
    const updated = {
      ...reg,
      status: 'RESULT_APPROVED' as any,
      finalSemproInfo: info
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  const handleReject = async () => {
    if (!reason) return alert('Silakan isi alasan penolakan!');
    const updated = {
      ...reg,
      status: 'RESULT_SUBMITTED' as any,
      rejectionReason: reason
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  return (
    <div className="card p-8 space-y-8">
       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
             <FileText className="text-primary" />
             <h3 className="font-bold text-slate-900 italic">Review Hasil Penelitian</h3>
          </div>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">Result Review</span>
       </div>

       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Penjadwalan Seminar Hasil</p>
          <div className="grid grid-cols-2 gap-4">
             <input type="date" className="input-field text-xs" value={info.tanggal} onChange={e => setInfo({...info, tanggal: e.target.value})} />
             <input type="time" className="input-field text-xs" value={info.pukul} onChange={e => setInfo({...info, pukul: e.target.value})} />
          </div>
          <input placeholder="Lokasi Seminar" className="input-field text-xs" value={info.lokasi} onChange={e => setInfo({...info, lokasi: e.target.value})} />
          <input placeholder="Panelis / Penguji" className="input-field text-xs" value={info.panelis} onChange={e => setInfo({...info, panelis: e.target.value})} />
          <input placeholder="Peserta" className="input-field text-xs" value={info.peserta} onChange={e => setInfo({...info, peserta: e.target.value})} />
          <textarea placeholder="Informasi Lainnya" className="input-field text-xs h-20" value={info.infoLain} onChange={e => setInfo({...info, infoLain: e.target.value})} />
       </div>

       <div className="flex gap-4">
          {!showReject ? (
            <>
              <button onClick={handleApprove} className="btn-primary flex-grow h-14 uppercase tracking-widest text-[10px]">Terima & Jadwalkan Seminar Hasil</button>
              <button onClick={() => setShowReject(true)} className="btn-primary bg-red-600 flex-grow h-14 uppercase tracking-widest text-[10px]">Tolak Hasil</button>
            </>
          ) : (
            <div className="w-full space-y-4">
               <textarea placeholder="Alasan penolakan & catatan perbaikan..." className="input-field h-24 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
               <div className="flex gap-4">
                 <button onClick={handleReject} className="btn-primary bg-red-600 flex-grow h-12 uppercase tracking-widest text-[10px]">Konfirmasi Tolak</button>
                 <button onClick={() => setShowReject(false)} className="btn-primary bg-slate-200 text-slate-900 flex-grow h-12 uppercase tracking-widest text-[10px]">Batal</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

function FinalSemproProofAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const handleApprove = async () => {
    const updated = { ...reg, status: 'REVISION_SUBMITTED' as any };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  const handleReject = async () => {
    if (!reason) return alert('Silakan isi alasan penolakan!');
    const updated = {
      ...reg,
      status: 'RESULT_APPROVED' as any,
      rejectionReason: reason
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  return (
    <div className="card p-8 space-y-8">
       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 italic">Review Bukti Seminar Hasil</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">Pending Approval</span>
       </div>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(reg.finalSemproProof?.dokumentasi || []).map((url, i) => (
            <a key={i} href={url} target="_blank" className="aspect-square rounded-xl overflow-hidden border border-slate-100 group relative">
               <img src={url} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="text-white" size={16} />
               </div>
            </a>
          ))}
          {reg.finalSemproProof?.catatan && (
            <a href={reg.finalSemproProof.catatan} target="_blank" className="aspect-square rounded-xl border border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-4">
               <FileText className="text-primary mb-2" size={24} />
               <span className="text-[9px] font-black text-primary uppercase text-center">Catatan Seminar Hasil</span>
            </a>
          )}
       </div>

       <div className="flex gap-4">
          {!showReject ? (
            <>
              <button onClick={handleApprove} className="btn-primary flex-grow h-14 uppercase tracking-widest text-[10px]">Setujui Bukti Seminar Hasil</button>
              <button onClick={() => setShowReject(true)} className="btn-primary bg-red-600 flex-grow h-14 uppercase tracking-widest text-[10px]">Tolak Bukti</button>
            </>
          ) : (
            <div className="w-full space-y-4">
               <textarea placeholder="Alasan penolakan..." className="input-field h-24 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
               <div className="flex gap-4">
                 <button onClick={handleReject} className="btn-primary bg-red-600 flex-grow h-12 uppercase tracking-widest text-[10px]">Konfirmasi Tolak</button>
                 <button onClick={() => setShowReject(false)} className="btn-primary bg-slate-200 text-slate-900 flex-grow h-12 uppercase tracking-widest text-[10px]">Batal</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

function RevisionAction({ reg, onAction }: { reg: PenelitianRegistration, onAction: () => void }) {
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const handleApprove = async () => {
    const updated = { ...reg, status: 'PUBLICATION' as any };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  const handleReject = async () => {
    if (!reason) return alert('Silakan isi alasan penolakan!');
    const updated = {
      ...reg,
      status: 'REVISION_SUBMITTED' as any,
      rejectionReason: reason
    };
    await penelitianService.saveRegistration(updated);
    onAction();
  };

  return (
    <div className="card p-8 space-y-8">
       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 italic">Review Hasil Revisi Final</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">Pending Review</span>
       </div>

       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <FileText className="text-primary" />
             <span className="text-sm font-bold text-slate-700 font-mono">REVISI_FINAL_PENELITIAN.pdf</span>
          </div>
          {reg.finalRevisionFile && (
            <button onClick={() => openDocument(reg.finalRevisionFile, `Revisi_Final_${reg.dosenName || 'Dosen'}`)} className="btn-primary h-10 px-6 text-[10px] flex items-center">Download</button>
          )}
       </div>

       <div className="flex gap-4">
          {!showReject ? (
            <>
              <button onClick={handleApprove} className="btn-primary flex-grow h-14 uppercase tracking-widest text-[10px]">Setujui Revisi & Publikasi</button>
              <button onClick={() => setShowReject(true)} className="btn-primary bg-red-600 flex-grow h-14 uppercase tracking-widest text-[10px]">Tolak Revisi</button>
            </>
          ) : (
            <div className="w-full space-y-4">
               <textarea placeholder="Catatan kekurangan revisi..." className="input-field h-24 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
               <div className="flex gap-4">
                 <button onClick={handleReject} className="btn-primary bg-red-600 flex-grow h-12 uppercase tracking-widest text-[10px]">Konfirmasi Tolak</button>
                 <button onClick={() => setShowReject(false)} className="btn-primary bg-slate-200 text-slate-900 flex-grow h-12 uppercase tracking-widest text-[10px]">Batal</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}
