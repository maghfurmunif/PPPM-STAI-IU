import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Loader2, User, Mail, Phone, MapPin, 
  BookOpen, Award, X, Camera, Upload, ExternalLink,
  GraduationCap, FlaskConical, HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

interface ResearcherProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  nimNidn: string | null;
  jurusan: string | null;
  fakultas: string | null;
  photoUrl: string | null;
  // Dosen specific
  nidn: string | null;
  nuptk: string | null;
  alamat: string | null;
  noHp: string | null;
  programStudi: string | null;
  // Stats
  publicationCount: number;
  researchCount: number;
  communityServiceCount: number;
}

export default function ProfilPenelitiPage() {
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedResearcher, setSelectedResearcher] = useState<ResearcherProfile | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    setLoading(true);
    try {
      // Fetch all dosen profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'DOSEN');

      if (profilesError) throw profilesError;

      // Fetch documentation counts per dosen
      const { data: docs } = await supabase
        .from('dosen_dokumentasi')
        .select('dosen_id');

      // Fetch research counts per dosen
      const { data: research } = await supabase
        .from('penelitian_registrations')
        .select('dosen_id');

      // Fetch community service counts per dosen
      const { data: community } = await supabase
        .from('pengabdian_registrations')
        .select('dosen_id');

      // Count per dosen
      const docCounts: Record<string, number> = {};
      const researchCounts: Record<string, number> = {};
      const communityCounts: Record<string, number> = {};

      (docs || []).forEach((d: any) => {
        docCounts[d.dosen_id] = (docCounts[d.dosen_id] || 0) + 1;
      });
      (research || []).forEach((r: any) => {
        researchCounts[r.dosen_id] = (researchCounts[r.dosen_id] || 0) + 1;
      });
      (community || []).forEach((c: any) => {
        communityCounts[c.dosen_id] = (communityCounts[c.dosen_id] || 0) + 1;
      });

      const mapped: ResearcherProfile[] = (profiles || []).map((p: any) => ({
        id: p.id,
        fullName: p.full_name || 'Dosen',
        email: p.email || '',
        role: p.role,
        nimNidn: p.nim_nidn || null,
        jurusan: p.jurusan || null,
        fakultas: p.fakultas || null,
        photoUrl: p.photo_url || null,
        nidn: p.nidn || null,
        nuptk: p.nuptk || null,
        alamat: p.alamat || null,
        noHp: p.no_hp || p.phone || null,
        programStudi: p.program_studi || p.jurusan || null,
        publicationCount: docCounts[p.id] || 0,
        researchCount: researchCounts[p.id] || 0,
        communityServiceCount: communityCounts[p.id] || 0,
      }));

      setResearchers(mapped);
    } catch (e) {
      console.error('Error fetching researchers:', e);
      toast.error('Gagal memuat data peneliti');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File, researcherId: string) => {
    try {
      setUploadingPhoto(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const url = await uploadToCloudinary(file);

      // Update profile photo_url
      const { error } = await supabase
        .from('profiles')
        .update({ photo_url: url })
        .eq('id', researcherId);

      if (error) throw error;

      // Update local state
      setResearchers(prev => prev.map(r => 
        r.id === researcherId ? { ...r, photoUrl: url } : r
      ));
      
      if (selectedResearcher?.id === researcherId) {
        setSelectedResearcher(prev => prev ? { ...prev, photoUrl: url } : null);
      }

      toast.success('Foto profil berhasil diperbarui');
    } catch (e) {
      console.error('Error uploading photo:', e);
      toast.error('Gagal mengunggah foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const filtered = researchers.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (r.nimNidn && r.nimNidn.toLowerCase().includes(search.toLowerCase())) ||
    (r.programStudi && r.programStudi.toLowerCase().includes(search.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Profil Peneliti</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Daftar dosen dan peneliti STAI Ihyaul Ulum Gresik yang aktif dalam kegiatan penelitian dan pengabdian masyarakat.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, NIDN, atau program studi..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Researcher Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Data Peneliti...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-20 text-center bg-white border-none shadow-xl rounded-[40px]">
            <User className="mx-auto text-slate-200 mb-6" size={60} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
              {search ? 'Tidak ada peneliti yang sesuai dengan pencarian.' : 'Belum ada data peneliti.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((researcher, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={researcher.id}
                onClick={() => setSelectedResearcher(researcher)}
                className="card p-6 bg-white hover:shadow-2xl transition-all duration-300 border-none shadow-lg group cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="relative shrink-0">
                    {researcher.photoUrl ? (
                      <img 
                        src={researcher.photoUrl} 
                        alt={researcher.fullName}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-primary/30 transition-colors"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-slate-100 group-hover:border-primary/30 transition-colors">
                        <span className="text-2xl font-black text-primary">{getInitials(researcher.fullName)}</span>
                      </div>
                    )}
                    {/* Photo upload button (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                        fileInputRef.current?.setAttribute('data-researcher-id', researcher.id);
                      }}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
                      title="Upload foto"
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-lg leading-tight truncate group-hover:text-primary transition-colors">
                      {researcher.fullName}
                    </h3>
                    {researcher.nimNidn && (
                      <p className="text-xs text-slate-500 font-bold mt-1">NIDN: {researcher.nimNidn}</p>
                    )}
                    {researcher.programStudi && (
                      <p className="text-xs text-primary font-bold mt-1 truncate">{researcher.programStudi}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <FlaskConical size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600">{researcher.researchCount} Penelitian</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HeartHandshake size={12} className="text-blue-500" />
                    <span className="text-xs font-bold text-slate-600">{researcher.communityServiceCount} Pengabdian</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-violet-500" />
                    <span className="text-xs font-bold text-slate-600">{researcher.publicationCount} Publikasi</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && researchers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 bg-white text-center">
              <p className="text-3xl font-black text-primary">{researchers.length}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Peneliti</p>
            </div>
            <div className="card p-6 bg-white text-center">
              <p className="text-3xl font-black text-emerald-500">{researchers.reduce((a, r) => a + r.researchCount, 0)}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Penelitian</p>
            </div>
            <div className="card p-6 bg-white text-center">
              <p className="text-3xl font-black text-blue-500">{researchers.reduce((a, r) => a + r.communityServiceCount, 0)}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Pengabdian</p>
            </div>
            <div className="card p-6 bg-white text-center">
              <p className="text-3xl font-black text-violet-500">{researchers.reduce((a, r) => a + r.publicationCount, 0)}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Publikasi</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const researcherId = fileInputRef.current?.getAttribute('data-researcher-id');
          if (file && researcherId) {
            await handlePhotoUpload(file, researcherId);
          }
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResearcher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedResearcher(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-br from-primary/5 to-transparent rounded-t-[32px]">
                <button 
                  onClick={() => setSelectedResearcher(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>

                <div className="flex items-start gap-6">
                  {/* Photo with upload */}
                  <div className="relative group">
                    {selectedResearcher.photoUrl ? (
                      <img 
                        src={selectedResearcher.photoUrl} 
                        alt={selectedResearcher.fullName}
                        className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl">
                        <span className="text-4xl font-black text-primary">{getInitials(selectedResearcher.fullName)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        fileInputRef.current?.setAttribute('data-researcher-id', selectedResearcher.id);
                      }}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="animate-spin text-white" size={24} />
                      ) : (
                        <div className="text-center text-white">
                          <Camera size={24} className="mx-auto mb-1" />
                          <span className="text-[9px] font-bold uppercase">Upload Foto</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Name & Role */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedResearcher.fullName}</h2>
                    {selectedResearcher.nimNidn && (
                      <p className="text-sm text-slate-500 font-bold mt-1">NIDN: {selectedResearcher.nimNidn}</p>
                    )}
                    {selectedResearcher.programStudi && (
                      <p className="text-sm text-primary font-bold mt-1">{selectedResearcher.programStudi}</p>
                    )}
                    
                    {/* Quick Stats */}
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg">
                        <FlaskConical size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">{selectedResearcher.researchCount} Penelitian</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
                        <HeartHandshake size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-700">{selectedResearcher.communityServiceCount} Pengabdian</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-lg">
                        <BookOpen size={14} className="text-violet-600" />
                        <span className="text-xs font-bold text-violet-700">{selectedResearcher.publicationCount} Publikasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Informasi Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedResearcher.email && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Mail size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.email}</p>
                      </div>
                    </div>
                  )}
                  {selectedResearcher.noHp && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Phone size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telepon</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.noHp}</p>
                      </div>
                    </div>
                  )}
                  {selectedResearcher.alamat && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl md:col-span-2">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.alamat}</p>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 pt-4">Informasi Akademik</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedResearcher.nidn && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Award size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIDN</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.nidn}</p>
                      </div>
                    </div>
                  )}
                  {selectedResearcher.nuptk && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <GraduationCap size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NUPTK</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.nuptk}</p>
                      </div>
                    </div>
                  )}
                  {selectedResearcher.jurusan && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <BookOpen size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurusan</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.jurusan}</p>
                      </div>
                    </div>
                  )}
                  {selectedResearcher.fakultas && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <BookOpen size={16} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fakultas</p>
                        <p className="text-sm font-bold text-slate-700">{selectedResearcher.fakultas}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 pt-0">
                <button 
                  onClick={() => setSelectedResearcher(null)}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
