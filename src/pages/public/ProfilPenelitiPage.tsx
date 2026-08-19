import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Loader2, User, Mail, Phone, MapPin, 
  BookOpen, Award, X, Camera, FlaskConical, HeartHandshake,
  GraduationCap, Shield, Calendar, Hash, Building2, Globe,
  FileText, Users, Briefcase
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
  photoUrl: string | null;
  // Identitas
  nidn: string | null;
  nuptk: string | null;
  nik: string | null;
  noKk: string | null;
  jenisKelamin: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  agama: string | null;
  // Kontak
  noHp: string | null;
  alamat: string | null;
  kodePos: string | null;
  emailDosen: string | null;
  // Kepegawaian
  statusKepegawaian: string | null;
  programStudi: string | null;
  jabatanStruktural: string | null;
  mkUtama: string | null;
  // Pendidikan
  s1: string | null;
  s2: string | null;
  s3: string | null;
  // Riset
  idSinta: string | null;
  googleScholar: string | null;
  sertifikasi: string | null;
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

  const currentUserId = localStorage.getItem('user_id');
  const currentUserRole = localStorage.getItem('user_role');

  const canUploadPhoto = (researcherId: string) => {
    return currentUserRole === 'ADMIN' || currentUserId === researcherId;
  };

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'DOSEN');

      if (profilesError) throw profilesError;

      // Fetch counts from related tables (RLS may block - handle gracefully)
      let docs: any[] = [];
      let research: any[] = [];
      let community: any[] = [];
      try {
        const docsResult = await supabase.from('dosen_dokumentasi').select('dosen_id');
        if (docsResult.data) docs = docsResult.data;
      } catch { /* RLS may block */ }
      try {
        const resResult = await supabase.from('penelitian_registrations').select('dosen_id');
        if (resResult.data) research = resResult.data;
      } catch { /* RLS may block */ }
      try {
        const comResult = await supabase.from('pengabdian_registrations').select('dosen_id');
        if (comResult.data) community = comResult.data;
      } catch { /* RLS may block */ }

      const docCounts: Record<string, number> = {};
      const researchCounts: Record<string, number> = {};
      const communityCounts: Record<string, number> = {};

      docs.forEach((d: any) => { docCounts[d.dosen_id] = (docCounts[d.dosen_id] || 0) + 1; });
      research.forEach((r: any) => { researchCounts[r.dosen_id] = (researchCounts[r.dosen_id] || 0) + 1; });
      community.forEach((c: any) => { communityCounts[c.dosen_id] = (communityCounts[c.dosen_id] || 0) + 1; });

      const mapped: ResearcherProfile[] = (profiles || []).map((p: any) => ({
        id: p.id,
        fullName: p.full_name || 'Dosen',
        email: p.email || '',
        role: p.role,
        photoUrl: p.photo_url || null,
        nidn: p.nidn || p.nim_nidn || null,
        nuptk: p.nuptk || null,
        nik: p.nik || null,
        noKk: p.no_kk || null,
        jenisKelamin: p.jenis_kelamin || null,
        tempatLahir: p.tempat_lahir || null,
        tanggalLahir: p.tanggal_lahir || null,
        agama: p.agama || null,
        noHp: p.no_hp || p.phone || null,
        alamat: p.alamat || p.alamat_jalan || null,
        kodePos: p.kode_pos || null,
        emailDosen: p.email_mahasiswa || p.email || null,
        statusKepegawaian: p.status_kepegawaian || null,
        programStudi: p.program_studi || p.jurusan || null,
        jabatanStruktural: p.jabatan_struktural || null,
        mkUtama: p.mk_utama || null,
        s1: p.pendidikan_s1 || p.s1 || null,
        s2: p.pendidikan_s2 || p.s2 || null,
        s3: p.pendidikan_s3 || p.s3 || null,
        idSinta: p.id_sinta || null,
        googleScholar: p.google_scholar || null,
        sertifikasi: p.sertifikasi || null,
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
    if (!canUploadPhoto(researcherId)) {
      toast.error('Anda tidak memiliki akses untuk mengubah foto profil ini');
      return;
    }
    try {
      setUploadingPhoto(true);
      const { uploadToCloudinary } = await import('@/src/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      const { error } = await supabase.from('profiles').update({ photo_url: url }).eq('id', researcherId);
      if (error) throw error;

      setResearchers(prev => prev.map(r => r.id === researcherId ? { ...r, photoUrl: url } : r));
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
    (r.nidn && r.nidn.toLowerCase().includes(search.toLowerCase())) ||
    (r.programStudi && r.programStudi.toLowerCase().includes(search.toLowerCase()))
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Profil Peneliti</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">Daftar dosen dan peneliti STAI Ihyaul Ulum Gresik yang aktif dalam kegiatan penelitian dan pengabdian masyarakat.</p>
        </div>

        <div className="flex justify-center">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input type="text" placeholder="Cari nama, NIDN, atau program studi..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Data Peneliti...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-20 text-center bg-white border-none shadow-xl rounded-[40px]">
            <User className="mx-auto text-slate-200 mb-6" size={60} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">{search ? 'Tidak ada peneliti yang sesuai.' : 'Belum ada data peneliti.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((researcher, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                key={researcher.id} onClick={() => setSelectedResearcher(researcher)}
                className="card p-6 bg-white hover:shadow-2xl transition-all duration-300 border-none shadow-lg group cursor-pointer hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    {researcher.photoUrl ? (
                      <img src={researcher.photoUrl} alt={researcher.fullName} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-primary/30 transition-colors" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-slate-100 group-hover:border-primary/30 transition-colors">
                        <span className="text-2xl font-black text-primary">{getInitials(researcher.fullName)}</span>
                      </div>
                    )}
                    {canUploadPhoto(researcher.id) && (
                      <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); fileInputRef.current?.setAttribute('data-researcher-id', researcher.id); }}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90" title="Upload foto">
                        <Camera size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-lg leading-tight truncate group-hover:text-primary transition-colors">{researcher.fullName}</h3>
                    {researcher.nidn && <p className="text-xs text-slate-500 font-bold mt-1">NIDN: {researcher.nidn}</p>}
                    {researcher.programStudi && <p className="text-xs text-primary font-bold mt-1 truncate">{researcher.programStudi}</p>}
                  </div>
                </div>
                <div className="flex gap-4 mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5"><FlaskConical size={12} className="text-emerald-500" /><span className="text-xs font-bold text-slate-600">{researcher.researchCount}</span></div>
                  <div className="flex items-center gap-1.5"><HeartHandshake size={12} className="text-blue-500" /><span className="text-xs font-bold text-slate-600">{researcher.communityServiceCount}</span></div>
                  <div className="flex items-center gap-1.5"><BookOpen size={12} className="text-violet-500" /><span className="text-xs font-bold text-slate-600">{researcher.publicationCount}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && researchers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 bg-white text-center"><p className="text-3xl font-black text-primary">{researchers.length}</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Peneliti</p></div>
            <div className="card p-6 bg-white text-center"><p className="text-3xl font-black text-emerald-500">{researchers.reduce((a, r) => a + r.researchCount, 0)}</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Penelitian</p></div>
            <div className="card p-6 bg-white text-center"><p className="text-3xl font-black text-blue-500">{researchers.reduce((a, r) => a + r.communityServiceCount, 0)}</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Pengabdian</p></div>
            <div className="card p-6 bg-white text-center"><p className="text-3xl font-black text-violet-500">{researchers.reduce((a, r) => a + r.publicationCount, 0)}</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Publikasi</p></div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const researcherId = fileInputRef.current?.getAttribute('data-researcher-id');
          if (file && researcherId) await handlePhotoUpload(file, researcherId);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }} />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResearcher && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedResearcher(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="relative p-8 bg-gradient-to-br from-primary/5 to-transparent rounded-t-[32px]">
                <button onClick={() => setSelectedResearcher(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-all"><X size={20} /></button>
                <div className="flex items-start gap-6">
                  <div className="relative group">
                    {selectedResearcher.photoUrl ? (
                      <img src={selectedResearcher.photoUrl} alt={selectedResearcher.fullName} className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl" />
                    ) : (
                      <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl">
                        <span className="text-4xl font-black text-primary">{getInitials(selectedResearcher.fullName)}</span>
                      </div>
                    )}
                    {canUploadPhoto(selectedResearcher.id) && (
                      <button onClick={() => { fileInputRef.current?.click(); fileInputRef.current?.setAttribute('data-researcher-id', selectedResearcher.id); }}
                        disabled={uploadingPhoto}
                        className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadingPhoto ? <Loader2 className="animate-spin text-white" size={24} /> : <div className="text-center text-white"><Camera size={24} className="mx-auto mb-1" /><span className="text-[9px] font-bold uppercase">Upload Foto</span></div>}
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedResearcher.fullName}</h2>
                    {selectedResearcher.nidn && <p className="text-sm text-slate-500 font-bold mt-1">NIDN: {selectedResearcher.nidn}</p>}
                    {selectedResearcher.programStudi && <p className="text-sm text-primary font-bold mt-1">{selectedResearcher.programStudi}</p>}
                    <div className="flex gap-3 mt-4 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg"><FlaskConical size={14} className="text-emerald-600" /><span className="text-xs font-bold text-emerald-700">{selectedResearcher.researchCount} Penelitian</span></div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg"><HeartHandshake size={14} className="text-blue-600" /><span className="text-xs font-bold text-blue-700">{selectedResearcher.communityServiceCount} Pengabdian</span></div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-lg"><BookOpen size={14} className="text-violet-600" /><span className="text-xs font-bold text-violet-700">{selectedResearcher.publicationCount} Publikasi</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Identitas */}
                <Section title="Identitas Pribadi" icon={<User size={14} />}>
                  <InfoRow icon={<Hash size={14} />} label="NIDN" value={selectedResearcher.nidn} />
                  <InfoRow icon={<Award size={14} />} label="NUPTK" value={selectedResearcher.nuptk} />
                  <InfoRow icon={<Hash size={14} />} label="NIK" value={selectedResearcher.nik} />
                  <InfoRow icon={<Users size={14} />} label="No KK" value={selectedResearcher.noKk} />
                  <InfoRow icon={<User size={14} />} label="Jenis Kelamin" value={selectedResearcher.jenisKelamin} />
                  <InfoRow icon={<MapPin size={14} />} label="Tempat, Tanggal Lahir" value={selectedResearcher.tempatLahir && selectedResearcher.tanggalLahir ? `${selectedResearcher.tempatLahir}, ${selectedResearcher.tanggalLahir}` : null} />
                  <InfoRow icon={<Globe size={14} />} label="Agama" value={selectedResearcher.agama} />
                </Section>

                {/* Kontak */}
                <Section title="Kontak & Alamat" icon={<Mail size={14} />}>
                  <InfoRow icon={<Mail size={14} />} label="Email" value={selectedResearcher.emailDosen || selectedResearcher.email} />
                  <InfoRow icon={<Phone size={14} />} label="No HP/WA" value={selectedResearcher.noHp} />
                  <InfoRow icon={<MapPin size={14} />} label="Alamat" value={selectedResearcher.alamat} />
                  <InfoRow icon={<Hash size={14} />} label="Kode Pos" value={selectedResearcher.kodePos} />
                </Section>

                {/* Kepegawaian */}
                <Section title="Kepegawaian & Jabatan" icon={<Briefcase size={14} />}>
                  <InfoRow icon={<Shield size={14} />} label="Status Kepegawaian" value={selectedResearcher.statusKepegawaian} />
                  <InfoRow icon={<Building2 size={14} />} label="Program Studi / Homebase" value={selectedResearcher.programStudi} />
                  <InfoRow icon={<Briefcase size={14} />} label="Jabatan Struktural" value={selectedResearcher.jabatanStruktural} />
                  <InfoRow icon={<BookOpen size={14} />} label="MK Utama" value={selectedResearcher.mkUtama} />
                </Section>

                {/* Pendidikan */}
                <Section title="Riwayat Pendidikan" icon={<GraduationCap size={14} />}>
                  <InfoRow icon={<GraduationCap size={14} />} label="S1" value={selectedResearcher.s1} />
                  <InfoRow icon={<GraduationCap size={14} />} label="S2" value={selectedResearcher.s2} />
                  <InfoRow icon={<GraduationCap size={14} />} label="S3" value={selectedResearcher.s3} />
                </Section>

                {/* Riset & Sertifikasi */}
                <Section title="Profil Riset & Sertifikasi" icon={<FlaskConical size={14} />}>
                  <InfoRow icon={<Award size={14} />} label="Status Sertifikasi" value={selectedResearcher.sertifikasi} />
                  <InfoRow icon={<FlaskConical size={14} />} label="ID SINTA" value={selectedResearcher.idSinta} link={selectedResearcher.idSinta ? `https://sinta.kemdikbud.go.id/authors/detail/${selectedResearcher.idSinta}` : undefined} />
                  <InfoRow icon={<Globe size={14} />} label="Google Scholar" value={selectedResearcher.googleScholar} link={selectedResearcher.googleScholar || undefined} />
                </Section>
              </div>

              <div className="p-8 pt-0">
                <button onClick={() => setSelectedResearcher(null)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors">Tutup</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">{icon}{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

/** Convert any value (string, object, array) to a displayable string */
function toDisplayString(value: any): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(toDisplayString).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    // Handle {jenjang, nama_kampus, tahun_lulus, program_studi} style objects
    const parts: string[] = [];
    if (value.nama_kampus) parts.push(value.nama_kampus);
    if (value.program_studi) parts.push(value.program_studi);
    if (value.jenjang) parts.push(value.jenjang);
    if (value.tahun_lulus) parts.push(`Lulus ${value.tahun_lulus}`);
    if (value.fakultas) parts.push(value.fakultas);
    if (value.jurusan) parts.push(value.jurusan);
    if (parts.length > 0) return parts.join(' - ');
    // Fallback: join all string values
    return Object.values(value).filter(v => typeof v === 'string' && v).join(', ');
  }
  return String(value);
}

function InfoRow({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: any; link?: string }) {
  const displayValue = toDisplayString(value);
  if (!displayValue) return null;
  const content = (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      <span className="text-primary shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate">{displayValue}</p>
      </div>
    </div>
  );
  if (link) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.02] transition-transform">{content}</a>;
  }
  return content;
}
