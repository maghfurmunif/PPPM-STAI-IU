import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, CheckCircle2, XCircle, Search, Filter,
  ChevronDown, ChevronRight, Eye, Download, FileText,
  Users, User, Calendar, BookOpen, Camera, ClipboardList,
  AlertTriangle, BarChart3, ArrowUpRight, Loader2, Info,
  Save, Plus, Trash2, FileUp, X, ChevronLeft, Clock, MapPin, Edit3, Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, openDocument } from '@/src/lib/utils';
import { 
  penelitianService, PenelitianRegistration, 
  hitungKelengkapan, persentaseKelengkapan, KelengkapanPenelitian 
} from '@/src/services/penelitianService';

// Label untuk setiap item checklist
const CHECKLIST_ITEMS: { key: keyof KelengkapanPenelitian; label: string; description: string; icon: any; type: 'metadata' | 'pdf' | 'photo' }[] = [
  { key: 'penelitiUtama', label: 'Peneliti Utama', description: 'Nama dosen peneliti utama', icon: User, type: 'metadata' },
  { key: 'coAuthor', label: 'Co-Author', description: 'Daftar co-author penelitian', icon: Users, type: 'metadata' },
  { key: 'judulPenelitian', label: 'Judul Penelitian', description: 'Judul lengkap penelitian', icon: BookOpen, type: 'metadata' },
  { key: 'skema', label: 'Skema', description: 'Internal / Hibah / Kerjasama / Mandiri', icon: ClipboardList, type: 'metadata' },
  { key: 'proposalPenelitian', label: 'Proposal Penelitian', description: 'File PDF proposal', icon: FileText, type: 'pdf' },
  { key: 'skReviewer', label: 'SK Reviewer', description: 'Surat Keputusan reviewer', icon: FileText, type: 'pdf' },
  { key: 'seminarProposal', label: 'Seminar Proposal', description: 'Foto dokumentasi sempro', icon: Camera, type: 'photo' },
  { key: 'skPenerimaan', label: 'SK Penerimaan', description: 'Surat Keputusan penerimaan', icon: FileText, type: 'pdf' },
  { key: 'logbookMonev', label: 'Logbook / Monev', description: 'Foto logbook monitoring', icon: ClipboardList, type: 'photo' },
  { key: 'seminarHasil', label: 'Seminar Hasil', description: 'Foto dokumentasi seminar hasil', icon: Camera, type: 'photo' },
  { key: 'laporanHasil', label: 'Laporan Hasil', description: 'PDF laporan hasil seminar', icon: FileText, type: 'pdf' },
];

const SKEMA_OPTIONS = [
  { value: '', label: '- Pilih Skema -' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'HIBAH', label: 'Hibah' },
  { value: 'KERJASAMA', label: 'Kerjasama' },
  { value: 'MANDIRI', label: 'Mandiri' },
];

export default function AdminKelengkapanPenelitian() {
  const [registrations, setRegistrations] = useState<PenelitianRegistration[]>([]);
  const [search, setSearch] = useState('');
  const [filterSkema, setFilterSkema] = useState('');
  const [filterKelengkapan, setFilterKelengkapan] = useState<'all' | 'lengkap' | 'tidak_lengkap'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingReg, setEditingReg] = useState<PenelitianRegistration | null>(null);
  const [saving, setSaving] = useState(false);
  const [dosenProfiles, setDosenProfiles] = useState<{ id: string; fullName: string; email?: string }[]>([]);

  const refreshData = async (quiet = false) => {
    if (!quiet) setLoading(true);
    const data = await penelitianService.getRegistrations();
    setRegistrations(data);
    const profiles = await penelitianService.getDosenProfiles();
    setDosenProfiles(profiles);
    if (!quiet) setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter & search
  const filtered = registrations.filter(r => {
    const matchSearch = !search || 
      r.dosenName?.toLowerCase().includes(search.toLowerCase()) ||
      r.judulPenelitian?.toLowerCase().includes(search.toLowerCase()) ||
      r.coAuthors?.toLowerCase().includes(search.toLowerCase());
    
    const matchSkema = !filterSkema || r.skema === filterSkema;
    
    const k = hitungKelengkapan(r);
    const pct = persentaseKelengkapan(k);
    const matchKelengkapan = filterKelengkapan === 'all' || 
      (filterKelengkapan === 'lengkap' && pct === 100) ||
      (filterKelengkapan === 'tidak_lengkap' && pct < 100);
    
    return matchSearch && matchSkema && matchKelengkapan;
  });

  // Statistik
  const stats = {
    total: registrations.length,
    lengkap: registrations.filter(r => persentaseKelengkapan(hitungKelengkapan(r)) === 100).length,
    tidakLengkap: registrations.filter(r => persentaseKelengkapan(hitungKelengkapan(r)) < 100).length,
  };

  const handleSaveMetadata = async (reg: PenelitianRegistration) => {
    try {
      setSaving(true);
      await penelitianService.saveRegistration(reg);
      toast.success('Data penelitian berhasil disimpan');
      setEditingReg(null);
      await refreshData(true);
    } catch (e) {
      toast.error('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading && registrations.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Memuat Data Kelengkapan...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-primary underline-offset-8">
            Kelengkapan Data Penelitian
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-xs">
            Kroscek & lengkapi 11 item berkas penelitian dosen. Klik item untuk edit atau unggah.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-slate-50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Penelitian</p>
              <p className="text-4xl font-black text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FlaskConical size={24} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="card p-6 bg-green-50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Lengkap (11/11)</p>
              <p className="text-4xl font-black text-green-900 mt-2">{stats.lengkap}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-6 bg-orange-50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Belum Lengkap</p>
              <p className="text-4xl font-black text-orange-900 mt-2">{stats.tidakLengkap}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama dosen, judul, atau co-author..." 
            className="input-field pl-12 py-3 w-full text-xs font-bold tracking-widest shadow-sm" 
            value={search}
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <select 
          className="input-field py-3 text-xs font-bold tracking-widest w-48"
          value={filterSkema}
          onChange={e => setFilterSkema(e.target.value)}
        >
          <option value="">Semua Skema</option>
          <option value="INTERNAL">Internal</option>
          <option value="HIBAH">Hibah</option>
          <option value="KERJASAMA">Kerjasama</option>
          <option value="MANDIRI">Mandiri</option>
        </select>
        <select 
          className="input-field py-3 text-xs font-bold tracking-widest w-48"
          value={filterKelengkapan}
          onChange={e => setFilterKelengkapan(e.target.value as any)}
        >
          <option value="all">Semua Status</option>
          <option value="lengkap">Lengkap Saja</option>
          <option value="tidak_lengkap">Belum Lengkap</option>
        </select>
      </div>

      {/* Data List */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center space-y-4 border-dashed">
          <FlaskConical className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            {registrations.length === 0 ? 'Belum ada data penelitian' : 'Tidak ada data yang cocok'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(reg => (
            <KelengkapanCard 
              key={reg.id} 
              registration={reg}
              isExpanded={expandedId === reg.id}
              onToggle={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
              onSaved={async () => await refreshData(true)}
            />
          ))}
        </div>
      )}

      {/* Edit Metadata Modal */}
      <AnimatePresence>
        {editingReg && (
          <EditMetadataModal 
            registration={editingReg}
            dosenProfiles={dosenProfiles}
            onSave={handleSaveMetadata}
            onClose={() => setEditingReg(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// KelengkapanCard — expanded view with interactive checklist
// =========================================================
function KelengkapanCard({ 
  registration, isExpanded, onToggle, onSaved
}: { 
  registration: PenelitianRegistration;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
  key?: string;
}) {
  const [localReg, setLocalReg] = useState(registration);
  const k = hitungKelengkapan(localReg);
  const pct = persentaseKelengkapan(k);
  const filledCount = Object.values(k).filter(Boolean).length;

  // Sync when parent data changes
  useEffect(() => { setLocalReg(registration); }, [registration.id, registration.updatedAt]);

  const handleUpdate = async (updates: Partial<PenelitianRegistration>) => {
    const updated = { ...localReg, ...updates };
    try {
      await penelitianService.saveRegistration(updated);
      setLocalReg(updated);
      toast.success('Tersimpan');
      onSaved();
    } catch (e) {
      toast.error('Gagal menyimpan');
    }
  };

  const getBarColor = () => {
    if (pct === 100) return 'bg-green-500';
    if (pct >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div layout className="card bg-white border-l-[6px] shadow-sm hover:shadow-md transition-all" style={{ borderLeftColor: pct === 100 ? '#22c55e' : pct >= 70 ? '#eab308' : '#f87171' }}>
      {/* Header row */}
      <button 
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <div className="shrink-0">
            {pct === 100 ? (
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-slate-900 truncate">{localReg.dosenName}</h4>
              {localReg.skema && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full shrink-0">
                  {localReg.skema}
                </span>
              )}
            </div>
            {localReg.judulPenelitian ? (
              <p className="text-xs text-slate-500 truncate italic">{localReg.judulPenelitian}</p>
            ) : (
              <p className="text-xs text-slate-400 italic">Judul belum diisi</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase">{filledCount}/11</span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", getBarColor())} style={{ width: `${pct}%` }} />
            </div>
            <span className={cn(
              "text-[10px] font-black",
              pct === 100 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-500"
            )}>{pct}%</span>
          </div>
          <ChevronDown size={18} className={cn("text-slate-400 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Mobile progress */}
              <div className="md:hidden flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-500 uppercase">{filledCount}/11 Item</span>
                <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", getBarColor())} style={{ width: `${pct}%` }} />
                </div>
                <span className={cn("text-xs font-black", pct === 100 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-500")}>{pct}%</span>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">11 Item Kelengkapan — Klik untuk edit / unggah</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {CHECKLIST_ITEMS.map((item, idx) => (
                    <InteractiveChecklistItem
                      key={item.key}
                      item={item}
                      index={idx}
                      registration={localReg}
                      isFilled={k[item.key]}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =========================================================
// InteractiveChecklistItem — each of the 11 items, clickable
// =========================================================
function InteractiveChecklistItem({
  item, index, registration, isFilled, onUpdate
}: {
  item: typeof CHECKLIST_ITEMS[number];
  index: number;
  registration: PenelitianRegistration;
  isFilled: boolean;
  onUpdate: (updates: Partial<PenelitianRegistration>) => Promise<void>;
  key?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Metadata inline edit states
  const [metaVal, setMetaVal] = useState('');

  const handleUploadPDF = async (file: File) => {
    try {
      setUploading(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      
      const fieldMap: Record<string, keyof PenelitianRegistration> = {
        proposalPenelitian: 'proposalFile',
        skReviewer: 'skReviewerFile',
        skPenerimaan: 'skPenerimaBantuanFile',
        laporanHasil: 'resultFile',
      };
      const field = fieldMap[item.key];
      if (field) {
        await onUpdate({ [field]: url });
      }
    } catch (e) {
      toast.error('Gagal mengunggah file');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPhotos = async (files: FileList) => {
    try {
      setUploading(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const urls = await Promise.all(Array.from(files).map(f => uploadToCloudinary(f)));
      
      if (item.key === 'seminarProposal') {
        const existing = registration.semproProof?.dokumentasi || [];
        await onUpdate({ semproProof: { dokumentasi: [...existing, ...urls], catatan: registration.semproProof?.catatan || '' } });
      } else if (item.key === 'seminarHasil') {
        const existing = registration.finalSemproProof?.dokumentasi || [];
        await onUpdate({ finalSemproProof: { dokumentasi: [...existing, ...urls], catatan: registration.finalSemproProof?.catatan || '' } });
      } else if (item.key === 'logbookMonev') {
        // Add a logbook entry for each photo
        const newLogbooks = urls.map((url, i) => ({
          id: crypto.randomUUID(),
          date: new Date().toISOString().split('T')[0],
          time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
          activity: `Dokumentasi Monev ${i + 1}`,
          note: `Foto dokumentasi logbook diunggah oleh admin`,
          photo: url,
          status: 'APPROVED' as const,
        }));
        await onUpdate({ logbooks: [...newLogbooks, ...(registration.logbooks || [])] });
      }
      toast.success('Foto berhasil diunggah');
    } catch (e) {
      toast.error('Gagal mengunggah foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMeta = async () => {
    const fieldMap: Record<string, keyof PenelitianRegistration> = {
      coAuthor: 'coAuthors',
      judulPenelitian: 'judulPenelitian',
      skema: 'skema',
    };
    const field = fieldMap[item.key];
    if (field) {
      await onUpdate({ [field]: metaVal });
      setExpanded(false);
    }
  };

  const getViewUrl = (): string | null => {
    const map: Record<string, string | null> = {
      proposalPenelitian: registration.proposalFile || null,
      skReviewer: registration.skReviewerFile || null,
      skPenerimaan: registration.skPenerimaBantuanFile || null,
      laporanHasil: registration.resultFile || null,
      seminarProposal: null,
      seminarHasil: null,
      logbookMonev: null,
    };
    return map[item.key];
  };

  const getPhotoCount = (): number => {
    if (item.key === 'seminarProposal') return registration.semproProof?.dokumentasi?.length || 0;
    if (item.key === 'seminarHasil') return registration.finalSemproProof?.dokumentasi?.length || 0;
    if (item.key === 'logbookMonev') return (registration.logbooks || []).filter(l => l.photo).length;
    return 0;
  };

  const getPhotoUrls = (): string[] => {
    if (item.key === 'seminarProposal') return registration.semproProof?.dokumentasi || [];
    if (item.key === 'seminarHasil') return registration.finalSemproProof?.dokumentasi || [];
    if (item.key === 'logbookMonev') return (registration.logbooks || []).filter(l => l.photo).map(l => l.photo!);
    return [];
  };

  const viewUrl = getViewUrl();
  const photoCount = getPhotoCount();
  const Icon = item.icon;

  // Metadata items → inline edit
  if (item.type === 'metadata' && item.key !== 'penelitiUtama') {
    return (
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        isFilled ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"
      )}>
        <button 
          onClick={() => {
            if (!expanded) {
              // Set initial value when opening
              const valMap: Record<string, string> = {
                coAuthor: registration.coAuthors || '',
                judulPenelitian: registration.judulPenelitian || '',
                skema: registration.skema || '',
              };
              setMetaVal(valMap[item.key] || '');
            }
            setExpanded(!expanded);
          }}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", isFilled ? "bg-green-100" : "bg-red-100")}>
            {isFilled ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-400" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className={cn("text-[10px] font-black uppercase tracking-widest", isFilled ? "text-green-700" : "text-red-600")}>
              {index + 1}. {item.label}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">
              {isFilled ? (item.key === 'skema' ? registration.skema : item.key === 'coAuthor' ? registration.coAuthors : registration.judulPenelitian) : 'Belum diisi — klik untuk tambah'}
            </p>
          </div>
          <Edit3 size={14} className={cn("shrink-0", isFilled ? "text-green-400" : "text-red-300")} />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                {item.key === 'skema' ? (
                  <select className="input-field w-full text-xs" value={metaVal} onChange={e => setMetaVal(e.target.value)}>
                    {SKEMA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input 
                    className="input-field w-full text-xs" 
                    value={metaVal}
                    onChange={e => setMetaVal(e.target.value)}
                    placeholder={item.key === 'judulPenelitian' ? 'Judul lengkap penelitian...' : 'Nama co-author (pisahkan koma)...'}
                  />
                )}
                <div className="flex gap-2">
                  <button onClick={handleSaveMeta} className="btn-primary flex-grow h-9 text-[9px] uppercase tracking-widest flex items-center justify-center gap-1">
                    <Save size={12} /> Simpan
                  </button>
                  <button onClick={() => setExpanded(false)} className="px-4 h-9 rounded-xl bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">Batal</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Peneliti Utama — read-only (always the dosen)
  if (item.key === 'penelitiUtama') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border bg-green-50/50 border-green-200">
        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} className="text-green-600" />
        </div>
        <div className="min-w-0 flex-grow">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">1. Peneliti Utama</p>
          <p className="text-[9px] text-slate-500 mt-0.5 truncate">{registration.dosenName}</p>
        </div>
        <User size={14} className="text-green-400 shrink-0" />
      </div>
    );
  }

  // PDF items → upload / view
  if (item.type === 'pdf') {
    return (
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        isFilled ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"
      )}>
        <div className="flex items-center gap-3 p-4">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", isFilled ? "bg-green-100" : "bg-red-100")}>
            {isFilled ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-400" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className={cn("text-[10px] font-black uppercase tracking-widest", isFilled ? "text-green-700" : "text-red-600")}>
              {index + 1}. {item.label}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">
              {isFilled ? '✓ File sudah diunggah' : 'Belum ada file — klik untuk unggah'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isFilled && viewUrl && (
              <button 
                onClick={() => openDocument(viewUrl, `${item.label}_${registration.dosenName}`)}
                className="p-2 hover:bg-white text-green-600 rounded-lg transition-colors"
                title="Lihat / Download"
              >
                <Eye size={14} />
              </button>
            )}
            <input 
              ref={fileRef} 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={e => e.target.files?.[0] && handleUploadPDF(e.target.files[0])}
            />
            <button 
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isFilled ? "hover:bg-white text-green-600" : "hover:bg-white text-red-400"
              )}
              title={isFilled ? 'Ganti file' : 'Unggah file'}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Photo items → upload multiple / view gallery
  if (item.type === 'photo') {
    const photoInputRef = useRef<HTMLInputElement>(null);
    return (
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        isFilled ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"
      )}>
        <div className="flex items-center gap-3 p-4">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", isFilled ? "bg-green-100" : "bg-red-100")}>
            {isFilled ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-400" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className={cn("text-[10px] font-black uppercase tracking-widest", isFilled ? "text-green-700" : "text-red-600")}>
              {index + 1}. {item.label}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">
              {photoCount > 0 ? `${photoCount} foto terunggah` : 'Belum ada foto — klik untuk unggah'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {photoCount > 0 && (
              <PhotoGalleryMini urls={getPhotoUrls()} title={item.label} />
            )}
            <input 
              ref={photoInputRef}
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple
              onChange={e => e.target.files && handleUploadPhotos(e.target.files)}
            />
            <button 
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isFilled ? "hover:bg-white text-green-600" : "hover:bg-white text-red-400"
              )}
              title="Unggah foto"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
          </div>
        </div>

        {/* Thumbnail strip when has photos */}
        {photoCount > 0 && (
          <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto">
            {getPhotoUrls().slice(0, 6).map((url, i) => (
              <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <img src={url} className="w-full h-full object-cover" />
              </div>
            ))}
            {photoCount > 6 && (
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 shrink-0">
                +{photoCount - 6}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// =========================================================
// PhotoGalleryMini — small inline gallery with lightbox
// =========================================================
function PhotoGalleryMini({ urls, title }: { urls: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') setIdx(i => (i > 0 ? i - 1 : urls.length - 1));
      if (e.key === 'ArrowRight') setIdx(i => (i < urls.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, urls.length]);

  return (
    <>
      <button 
        onClick={() => { setIdx(0); setOpen(true); }}
        className="p-2 hover:bg-white text-green-600 rounded-lg transition-colors"
        title="Lihat galeri foto"
      >
        <Eye size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{title}</p>
                <p className="text-white text-sm font-bold">{idx + 1} / {urls.length}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            {urls.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setIdx(i => i > 0 ? i - 1 : urls.length - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIdx(i => i < urls.length - 1 ? i + 1 : 0); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <motion.img
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={urls[idx]}
              alt={`${title} ${idx + 1}`}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            {urls.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center gap-2 overflow-x-auto">
                  {urls.map((img, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                      className={cn(
                        "w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                        i === idx ? "border-white scale-110 shadow-lg" : "border-white/20 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// =========================================================
// EditMetadataModal
// =========================================================
function EditMetadataModal({ 
  registration, dosenProfiles, onSave, onClose, saving 
}: { 
  registration: PenelitianRegistration;
  dosenProfiles: { id: string; fullName: string; email?: string }[];
  onSave: (reg: PenelitianRegistration) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    dosenId: registration.dosenId,
    judulPenelitian: registration.judulPenelitian || '',
    coAuthors: registration.coAuthors || '',
    skema: registration.skema || '',
    tahunPenelitian: registration.tahunPenelitian || '',
  });

  const handleSave = () => {
    const updated = {
      ...registration,
      dosenId: form.dosenId,
      dosenName: dosenProfiles.find(p => p.id === form.dosenId)?.fullName || registration.dosenName,
      judulPenelitian: form.judulPenelitian,
      coAuthors: form.coAuthors,
      skema: form.skema as any,
      tahunPenelitian: form.tahunPenelitian,
    };
    onSave(updated);
  };

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
          <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Edit Metadata Penelitian</h3>
          <p className="text-xs text-slate-500 mt-1">Lengkapi data penelitian untuk kroscek kelengkapan.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Peneliti Utama</label>
            <select 
              className="input-field w-full text-xs" 
              value={form.dosenId}
              onChange={e => setForm(prev => ({ ...prev, dosenId: e.target.value }))}
            >
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
              onChange={e => setForm(prev => ({ ...prev, judulPenelitian: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Co-Author</label>
            <input 
              type="text" 
              className="input-field w-full text-xs" 
              placeholder="Nama co-author (pisahkan koma jika lebih dari satu)"
              value={form.coAuthors}
              onChange={e => setForm(prev => ({ ...prev, coAuthors: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Skema</label>
              <select 
                className="input-field w-full text-xs"
                value={form.skema}
                onChange={e => setForm(prev => ({ ...prev, skema: e.target.value }))}
              >
                {SKEMA_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Tahun Penelitian</label>
              <input 
                type="text" 
                className="input-field w-full text-xs" 
                placeholder="Contoh: 2024"
                value={form.tahunPenelitian}
                onChange={e => setForm(prev => ({ ...prev, tahunPenelitian: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary flex-grow h-12 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            Simpan Metadata
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
