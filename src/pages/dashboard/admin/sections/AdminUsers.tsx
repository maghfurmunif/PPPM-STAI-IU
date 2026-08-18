import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Edit2, X, User, 
  Mail, MessageCircle, Loader2, Save,
  GraduationCap, ClipboardList, MapPin, Trash2,
  FlaskConical, Globe, BookOpen, Layers, Filter
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { 
  MahasiswaProfile, DosenProfile, UserProfile, AdminProfile,
  MAHASISWA_TABS, DOSEN_TABS,
  JenisKelamin, Agama, StatusSipil, KelasType, StatusMaba, StatusKelulusan,
  StatusKepegawaian, Golongan, JenjangPendidikan
} from '@/src/types/profiles';

const ANGKATAN_OPTIONS = Array.from({ length: 13 }, (_, i) => (2013 + i).toString());
const PRODI_OPTIONS = ['Pendidikan Agama Islam', 'Pendidikan Bahasa Arab', 'Pendidikan Guru Madrasah Ibtidaiyah'];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editTab, setEditTab] = useState(0);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterAngkatan, setFilterAngkatan] = useState<string>('ALL');
  const [filterProdi, setFilterProdi] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setUsers(data);
    } catch (e) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) return;
    try {
      const VALID_COLUMNS = [
        'full_name', 'email', 'role', 'avatar_url',
        'nim', 'nimko', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
        'agama', 'kewarganegaraan', 'nik', 'nisn', 'no_kk',
        'alamat_jalan', 'alamat_rt', 'alamat_rw', 'alamat_desa',
        'alamat_kecamatan', 'alamat_kabupaten', 'alamat_provinsi',
        'kode_pos', 'email_mahasiswa', 'no_hp', 'phone', 'status_sipil',
        'nama_kepala_keluarga', 'nama_ayah', 'nik_ayah', 'ttl_ayah',
        'pekerjaan_ayah', 'pendidikan_ayah', 'nama_ibu', 'nik_ibu',
        'ttl_ibu', 'pekerjaan_ibu', 'pendidikan_ibu',
        'asal_sekolah', 'tahun_lulus_sekolah', 'jurusan_sekolah',
        'kode_pt', 'nama_pt', 'program_studi', 'tahun_masuk', 'angkatan',
        'kelas', 'status_maba', 'jalur_pendaftaran', 'gelombang',
        'dpa', 'penerima_kps', 'no_kip', 'status_beasiswa',
        'status_kelulusan', 'judul_skripsi', 'pin_ijazah', 'nirl',
        'no_transkrip', 'no_sk_lulus', 'tanggal_lulus', 'tanggal_ijazah', 'periode_lulus',
        'kode_dosen', 'gelar_akademik', 'niy', 'nidn', 'nuptk',
        'nama_ibu_kandung', 'nama_suami_istri', 'email_dosen',
        'alamat_rumah', 'kecamatan', 'kabupaten',
        'status_kepegawaian', 'tanggal_mulai_mengajar', 'mk_utama',
        'nama_ptais', 'homebase_prodi', 'jabatan_struktural',
        'sktp', 'no_sktp', 'sk_pertama', 'sk_terakhir',
        'pendidikan_s1', 'pendidikan_s2', 'pendidikan_s3',
        'jabfung_pertama', 'jabfung_kedua', 'jabfung_terakhir', 'inpassing',
        'status_sertifikasi', 'tanggal_sertifikasi', 'keahlian_sertifikasi',
        'nomor_serdik', 'nrd', 'id_sinta', 'link_google_scholar',
        'alamat', 'ttl', 'jabatan', 'publications', 'semester',
        'nim_nidn', 'jurusan', 'fakultas', 'nomor_sk_yayasan',
      ];
      const cleanData: Record<string, any> = {};
      VALID_COLUMNS.forEach(col => {
        if (editingUser[col] !== undefined && editingUser[col] !== null) {
          cleanData[col] = editingUser[col];
        }
      });
      const { error } = await supabase
        .from('profiles')
        .update(cleanData)
        .eq('id', editingUser.id);
      if (error) throw error;
      toast.success('Profil berhasil diperbarui');
      setIsEditModalOpen(false);
      const updatedUser = { ...selectedUser, ...editingUser };
      setSelectedUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch (e: any) {
      toast.error('Gagal memperbarui profil: ' + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengguna ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
      toast.success('Pengguna berhasil dihapus');
    } catch (e) {
      toast.error('Gagal menghapus pengguna');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.nim_nidn?.toLowerCase().includes(search.toLowerCase()) ||
      u.nim?.toLowerCase().includes(search.toLowerCase()) ||
      u.nidn?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const matchesAngkatan = filterAngkatan === 'ALL' || u.angkatan === filterAngkatan;
    const matchesProdi = filterProdi === 'ALL' || u.program_studi === filterProdi || u.jurusan === filterProdi;
    return matchesSearch && matchesRole && matchesAngkatan && matchesProdi;
  });

  const openEdit = (user: any) => {
    setEditingUser({ ...user });
    setEditTab(0);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-500 font-medium mt-2">Administrasi otorisasi dan biodata pengguna.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Cari nama, email, NIM..." 
              className="input-field pl-10 h-11 w-72 text-sm"
              value={search} onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={cn("p-3 rounded-xl border transition-all", showFilters ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:border-primary/30")}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="card p-4 bg-white border border-slate-100 rounded-xl flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Angkatan:</span>
                <select value={filterAngkatan} onChange={e => setFilterAngkatan(e.target.value)} className="input-field h-9 text-xs w-24">
                  <option value="ALL">Semua</option>
                  {ANGKATAN_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Prodi:</span>
                <select value={filterProdi} onChange={e => setFilterProdi(e.target.value)} className="input-field h-9 text-xs w-48">
                  <option value="ALL">Semua Prodi</option>
                  {PRODI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Tabs */}
      <div className="flex gap-2">
        {['ALL', 'ADMIN', 'DOSEN', 'MAHASISWA'].map(role => (
          <button key={role} onClick={() => setFilterRole(role)}
            className={cn("px-5 py-2.5 rounded-xl text-xs font-medium transition-all border",
              filterRole === role ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-primary/30"
            )}>
            {role} {role !== 'ALL' && <span className="ml-1 text-[10px] opacity-70">({users.filter(u => u.role === role).length})</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-1 space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="card p-10 text-center text-slate-400 text-sm">Tidak ada data ditemukan.</div>
          ) : (
            filteredUsers.map(user => (
              <button key={user.id} onClick={() => setSelectedUser(user)}
                className={cn("w-full card p-4 text-left transition-all border-l-4 flex items-center space-x-3",
                  selectedUser?.id === user.id ? "border-l-primary shadow-md bg-white" : "border-l-transparent bg-white/50 hover:bg-white hover:border-l-slate-300"
                )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                  user.role === 'ADMIN' ? "bg-slate-900 text-white" : user.role === 'DOSEN' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                )}>
                  {user.full_name?.charAt(0) || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.full_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.nim || user.nidn || user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div key={selectedUser.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {/* User Header Card */}
                <div className="card p-8 bg-white border border-slate-100 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
                        {selectedUser.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedUser.full_name || 'BELUM DIISI'}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold",
                            selectedUser.role === 'ADMIN' ? "bg-slate-100 text-slate-600" : selectedUser.role === 'DOSEN' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                          )}>{selectedUser.role}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-[10px] text-slate-400">Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEdit(selectedUser)} className="btn-primary h-10 px-5 rounded-xl text-xs flex items-center space-x-2">
                        <Edit2 size={14} /><span>Edit</span>
                      </button>
                      <button onClick={() => handleDelete(selectedUser.id)} className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                    <InfoBlock label={selectedUser.role === 'DOSEN' ? 'NIDN' : 'NIM'} value={selectedUser.nidn || selectedUser.nim || selectedUser.nim_nidn} />
                    <InfoBlock label="Email" value={selectedUser.email} />
                    <InfoBlock label="No HP" value={selectedUser.no_hp || selectedUser.phone} />
                    <InfoBlock label="Prodi" value={selectedUser.program_studi || selectedUser.jurusan} />
                  </div>
                </div>

                {/* Full Detail Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailCard title="Data Diri">
                    <DetailRow label="Tempat, Tanggal Lahir" value={`${selectedUser.tempat_lahir || '-'}, ${selectedUser.tanggal_lahir || '-'}`} />
                    <DetailRow label="Jenis Kelamin" value={selectedUser.jenis_kelamin || '-'} />
                    <DetailRow label="Agama" value={selectedUser.agama || '-'} />
                    <DetailRow label="NIK" value={selectedUser.nik || '-'} />
                    <DetailRow label="No KK" value={selectedUser.no_kk || '-'} />
                    {selectedUser.role === 'MAHASISWA' && (
                      <>
                        <DetailRow label="NISN" value={selectedUser.nisn || '-'} />
                        <DetailRow label="Status Sipil" value={selectedUser.status_sipil || '-'} />
                      </>
                    )}
                  </DetailCard>

                  <DetailCard title="Kontak & Alamat">
                    <DetailRow label="Email Alternatif" value={selectedUser.email_mahasiswa || selectedUser.email_dosen || '-'} />
                    <DetailRow label="No HP/WA" value={selectedUser.no_hp || selectedUser.phone || '-'} />
                    <DetailRow label="Alamat" value={selectedUser.alamat_rumah || selectedUser.alamat_jalan || selectedUser.alamat || '-'} />
                    <DetailRow label="Kecamatan" value={selectedUser.kecamatan || selectedUser.alamat_kecamatan || '-'} />
                    <DetailRow label="Kabupaten" value={selectedUser.kabupaten || selectedUser.alamat_kabupaten || '-'} />
                    <DetailRow label="Kode Pos" value={selectedUser.kode_pos || '-'} />
                  </DetailCard>

                  {selectedUser.role === 'MAHASISWA' && (
                    <>
                      <DetailCard title="Data Akademik">
                        <DetailRow label="Program Studi" value={selectedUser.program_studi || selectedUser.jurusan || '-'} />
                        <DetailRow label="Angkatan" value={selectedUser.angkatan || selectedUser.tahun_masuk || '-'} />
                        <DetailRow label="Kelas" value={selectedUser.kelas || '-'} />
                        <DetailRow label="Semester" value={selectedUser.semester || '-'} />
                        <DetailRow label="DPA" value={selectedUser.dpa || '-'} />
                        <DetailRow label="Status Kelulusan" value={selectedUser.status_kelulusan || 'Aktif'} />
                        <DetailRow label="Judul Skripsi" value={selectedUser.judul_skripsi || '-'} />
                      </DetailCard>

                      <DetailCard title="Data Orang Tua">
                        <DetailRow label="Nama Ayah" value={selectedUser.nama_ayah || '-'} />
                        <DetailRow label="Pekerjaan Ayah" value={selectedUser.pekerjaan_ayah || '-'} />
                        <DetailRow label="Nama Ibu" value={selectedUser.nama_ibu || '-'} />
                        <DetailRow label="Pekerjaan Ibu" value={selectedUser.pekerjaan_ibu || '-'} />
                      </DetailCard>
                    </>
                  )}

                  {selectedUser.role === 'DOSEN' && (
                    <>
                      <DetailCard title="Kepegawaian">
                        <DetailRow label="Status" value={selectedUser.status_kepegawaian || '-'} />
                        <DetailRow label="Homebase Prodi" value={selectedUser.homebase_prodi || selectedUser.jurusan || '-'} />
                        <DetailRow label="Jabatan Struktural" value={selectedUser.jabatan_struktural || selectedUser.jabatan || '-'} />
                        <DetailRow label="Mulai Mengajar" value={selectedUser.tanggal_mulai_mengajar || '-'} />
                        <DetailRow label="SKTP" value={selectedUser.no_sktp || '-'} />
                      </DetailCard>

                      <DetailCard title="Sertifikasi & Riset">
                        <DetailRow label="Status Sertifikasi" value={selectedUser.status_sertifikasi || '-'} />
                        <DetailRow label="No Serdik" value={selectedUser.nomor_serdik || '-'} />
                        <DetailRow label="ID SINTA" value={selectedUser.id_sinta || '-'} />
                        <DetailRow label="Google Scholar" value={selectedUser.link_google_scholar || '-'} />
                      </DetailCard>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="card h-[500px] flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-2xl">
                <Users size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400">Pilih Pengguna</h3>
                <p className="text-xs text-slate-400 mt-1">Klik salah satu di panel kiri untuk melihat detail.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-5xl shadow-2xl my-8 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Biodata</h2>
                  <p className="text-xs text-slate-500 mt-1">{editingUser.full_name} — {editingUser.role}</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X size={20} /></button>
              </div>

              {/* Modal Tabs */}
              <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 overflow-x-auto">
                {(editingUser.role === 'DOSEN' ? DOSEN_TABS : editingUser.role === 'MAHASISWA' ? MAHASISWA_TABS : [{ id: 'basic', label: 'Biodata', icon: null }]).map((tab, idx) => (
                  <button key={tab.id} type="button" onClick={() => setEditTab(idx)}
                    className={cn("px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all border-b-2 -mb-px",
                      editTab === idx ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-700"
                    )}>
                    <span className="mr-1">{idx + 1}.</span>{tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {editingUser.role === 'MAHASISWA' && (
                    <>
                      {editTab === 0 && <EditMahasiswaBiodata user={editingUser} setUser={setEditingUser} />}
                      {editTab === 1 && <EditMahasiswaKontak user={editingUser} setUser={setEditingUser} />}
                      {editTab === 2 && <EditMahasiswaOrangTua user={editingUser} setUser={setEditingUser} />}
                      {editTab === 3 && <EditMahasiswaAkademik user={editingUser} setUser={setEditingUser} />}
                    </>
                  )}
                  {editingUser.role === 'DOSEN' && (
                    <>
                      {editTab === 0 && <EditDosenBiodata user={editingUser} setUser={setEditingUser} />}
                      {editTab === 1 && <EditDosenKepegawaian user={editingUser} setUser={setEditingUser} />}
                      {editTab === 2 && <EditDosenPendidikan user={editingUser} setUser={setEditingUser} />}
                      {editTab === 3 && <EditDosenSertifikasi user={editingUser} setUser={setEditingUser} />}
                    </>
                  )}
                  {editingUser.role === 'ADMIN' && (
                    <div className="space-y-5">
                      <FormInput label="Nama Lengkap" value={editingUser.full_name || ''} onChange={v => setEditingUser({ ...editingUser, full_name: v })} />
                      <FormInput label="Email" value={editingUser.email || ''} onChange={v => setEditingUser({ ...editingUser, email: v })} />
                    </div>
                  )}
                </div>

                {/* Save */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button type="submit" className="btn-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2">
                    <Save size={16} /><span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── EDIT FORMS ────────────────────────────────────────────────────────────

function FormInput({ label, value, onChange, placeholder, readOnly, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; readOnly?: boolean; maxLength?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input className={cn("input-field h-10 text-sm", readOnly && "bg-slate-50 text-slate-500 cursor-not-allowed")}
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} maxLength={maxLength} />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <select className="input-field h-10 text-sm appearance-none" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Pilih</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FormTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <textarea className="input-field text-sm min-h-[80px] py-2" value={value} onChange={e => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

function FormSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center space-x-2 pb-2 border-b border-slate-100">
        <span className="w-1 h-4 bg-primary rounded-full" /><span>{title}</span>
      </h4>
      {children}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

// Mahasiswa Edit Forms
function EditMahasiswaBiodata({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Identitas Pokok">
        <FieldRow>
          <FormInput label="NIM" value={user.nim || ''} onChange={u('nim')} maxLength={20} />
          <FormInput label="NIMKO" value={user.nimko || ''} onChange={u('nimko')} />
        </FieldRow>
        <FormInput label="Nama Lengkap" value={user.full_name || ''} onChange={u('full_name')} />
        <FieldRow>
          <FormInput label="Tempat Lahir" value={user.tempat_lahir || ''} onChange={u('tempat_lahir')} />
          <FormInput label="Tanggal Lahir" value={user.tanggal_lahir || ''} onChange={u('tanggal_lahir')} placeholder="DD/MM/YYYY" />
        </FieldRow>
        <FieldRow>
          <FormSelect label="Jenis Kelamin" value={user.jenis_kelamin || ''} onChange={u('jenis_kelamin')} options={['Laki-laki', 'Perempuan']} />
          <FormSelect label="Agama" value={user.agama || ''} onChange={u('agama')} options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']} />
        </FieldRow>
        <FieldRow>
          <FormInput label="NIK" value={user.nik || ''} onChange={u('nik')} maxLength={16} />
          <FormInput label="NISN" value={user.nisn || ''} onChange={u('nisn')} maxLength={10} />
        </FieldRow>
        <FormInput label="No KK" value={user.no_kk || ''} onChange={u('no_kk')} maxLength={16} />
      </FormSection>
    </div>
  );
}

function EditMahasiswaKontak({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Kontak & Domisili">
        <FieldRow>
          <FormInput label="Email" value={user.email_mahasiswa || user.email || ''} onChange={u('email_mahasiswa')} />
          <FormInput label="No HP/WA" value={user.no_hp || user.phone || ''} onChange={u('no_hp')} />
        </FieldRow>
        <FormSelect label="Status Sipil" value={user.status_sipil || ''} onChange={u('status_sipil')} options={['Belum Menikah', 'Sudah Menikah', 'Cerai']} />
        <FormTextarea label="Alamat Jalan" value={user.alamat_jalan || user.alamat || ''} onChange={u('alamat_jalan')} rows={2} />
        <FieldRow>
          <FormInput label="RT" value={user.alamat_rt || ''} onChange={u('alamat_rt')} />
          <FormInput label="RW" value={user.alamat_rw || ''} onChange={u('alamat_rw')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="Desa/Kelurahan" value={user.alamat_desa || ''} onChange={u('alamat_desa')} />
          <FormInput label="Kecamatan" value={user.alamat_kecamatan || ''} onChange={u('alamat_kecamatan')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="Kabupaten" value={user.alamat_kabupaten || ''} onChange={u('alamat_kabupaten')} />
          <FormInput label="Provinsi" value={user.alamat_provinsi || ''} onChange={u('alamat_provinsi')} />
        </FieldRow>
        <FormInput label="Kode Pos" value={user.kode_pos || ''} onChange={u('kode_pos')} maxLength={5} />
      </FormSection>
    </div>
  );
}

function EditMahasiswaOrangTua({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Data Orang Tua">
        <FieldRow>
          <div className="space-y-4">
            <h5 className="text-xs font-semibold text-primary">Ayah</h5>
            <FormInput label="Nama Ayah" value={user.nama_ayah || ''} onChange={u('nama_ayah')} />
            <FormInput label="NIK Ayah" value={user.nik_ayah || ''} onChange={u('nik_ayah')} maxLength={16} />
            <FormInput label="Pekerjaan" value={user.pekerjaan_ayah || ''} onChange={u('pekerjaan_ayah')} />
            <FormSelect label="Pendidikan" value={user.pendidikan_ayah || ''} onChange={u('pendidikan_ayah')} options={['S1', 'S2', 'S3', 'SMA', 'SMK', 'MA', 'SMP']} />
          </div>
          <div className="space-y-4">
            <h5 className="text-xs font-semibold text-primary">Ibu</h5>
            <FormInput label="Nama Ibu" value={user.nama_ibu || ''} onChange={u('nama_ibu')} />
            <FormInput label="NIK Ibu" value={user.nik_ibu || ''} onChange={u('nik_ibu')} maxLength={16} />
            <FormInput label="Pekerjaan" value={user.pekerjaan_ibu || ''} onChange={u('pekerjaan_ibu')} />
            <FormSelect label="Pendidikan" value={user.pendidikan_ibu || ''} onChange={u('pendidikan_ibu')} options={['S1', 'S2', 'S3', 'SMA', 'SMK', 'MA', 'SMP']} />
          </div>
        </FieldRow>
      </FormSection>
      <FormSection title="Pendidikan Sebelumnya">
        <FieldRow>
          <FormInput label="Asal Sekolah" value={user.asal_sekolah || ''} onChange={u('asal_sekolah')} />
          <FormInput label="Tahun Lulus" value={user.tahun_lulus_sekolah || ''} onChange={u('tahun_lulus_sekolah')} maxLength={4} />
        </FieldRow>
        <FormInput label="Jurusan Sekolah" value={user.jurusan_sekolah || ''} onChange={u('jurusan_sekolah')} />
      </FormSection>
    </div>
  );
}

function EditMahasiswaAkademik({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Data Akademik">
        <FieldRow>
          <FormInput label="Program Studi" value={user.program_studi || user.jurusan || ''} onChange={u('program_studi')} />
          <FormInput label="Angkatan" value={user.angkatan || user.tahun_masuk || ''} onChange={u('angkatan')} maxLength={4} />
        </FieldRow>
        <FieldRow>
          <FormSelect label="Kelas" value={user.kelas || ''} onChange={u('kelas')} options={['Reguler', 'Non Reguler']} />
          <FormSelect label="Status Maba" value={user.status_maba || ''} onChange={u('status_maba')} options={['Baru', 'Transfer']} />
        </FieldRow>
        <FormInput label="DPA" value={user.dpa || ''} onChange={u('dpa')} />
      </FormSection>
      <FormSection title="Kelulusan (Read-Only Admin)">
        <FieldRow>
          <FormSelect label="Status Kelulusan" value={user.status_kelulusan || 'Aktif'} onChange={u('status_kelulusan')} options={['Aktif', 'Lulus', 'DO', 'Mengundurkan Diri']} />
          <FormInput label="Judul Skripsi" value={user.judul_skripsi || ''} onChange={u('judul_skripsi')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="PIN Ijazah" value={user.pin_ijazah || ''} onChange={u('pin_ijazah')} readOnly />
          <FormInput label="NIRL" value={user.nirl || ''} onChange={u('nirl')} readOnly />
        </FieldRow>
        <FieldRow>
          <FormInput label="No Transkrip" value={user.no_transkrip || ''} onChange={u('no_transkrip')} readOnly />
          <FormInput label="No SK Lulus" value={user.no_sk_lulus || ''} onChange={u('no_sk_lulus')} readOnly />
        </FieldRow>
        <FieldRow>
          <FormInput label="Tanggal Lulus" value={user.tanggal_lulus || ''} onChange={u('tanggal_lulus')} readOnly />
          <FormInput label="Tanggal Ijazah" value={user.tanggal_ijazah || ''} onChange={u('tanggal_ijazah')} readOnly />
        </FieldRow>
      </FormSection>
    </div>
  );
}

// Dosen Edit Forms
function EditDosenBiodata({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Identitas Pokok">
        <FieldRow>
          <FormInput label="Kode Dosen" value={user.kode_dosen || ''} onChange={u('kode_dosen')} />
          <FormInput label="Nama Lengkap" value={user.full_name || ''} onChange={u('full_name')} />
        </FieldRow>
        <FormInput label="Gelar Akademik" value={user.gelar_akademik || ''} onChange={u('gelar_akademik')} />
        <FieldRow>
          <FormInput label="NIY" value={user.niy || ''} onChange={u('niy')} />
          <FormInput label="NIDN" value={user.nidn || ''} onChange={u('nidn')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="NUPTK" value={user.nuptk || ''} onChange={u('nuptk')} />
          <FormSelect label="Jenis Kelamin" value={user.jenis_kelamin || ''} onChange={u('jenis_kelamin')} options={['Laki-laki', 'Perempuan']} />
        </FieldRow>
        <FieldRow>
          <FormInput label="NIK" value={user.nik || ''} onChange={u('nik')} maxLength={16} />
          <FormInput label="No KK" value={user.no_kk || ''} onChange={u('no_kk')} maxLength={16} />
        </FieldRow>
        <FieldRow>
          <FormInput label="Tempat, Tanggal Lahir" value={`${user.tempat_lahir || ''}, ${user.tanggal_lahir || ''}`} onChange={(v) => {
            const parts = v.split(', ');
            setUser({ ...user, tempat_lahir: parts[0] || '', tanggal_lahir: parts[1] || '' });
          }} />
          <FormInput label="No HP/WA" value={user.no_hp || user.phone || ''} onChange={u('no_hp')} />
        </FieldRow>
      </FormSection>
      <FormSection title="Kontak">
        <FormInput label="Email" value={user.email_dosen || user.email || ''} onChange={u('email_dosen')} />
        <FormTextarea label="Alamat" value={user.alamat_rumah || user.alamat || ''} onChange={u('alamat_rumah')} rows={2} />
        <FieldRow>
          <FormInput label="Kecamatan" value={user.kecamatan || ''} onChange={u('kecamatan')} />
          <FormInput label="Kabupaten" value={user.kabupaten || ''} onChange={u('kabupaten')} />
        </FieldRow>
      </FormSection>
    </div>
  );
}

function EditDosenKepegawaian({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Kepegawaian & Homebase">
        <FieldRow>
          <FormSelect label="Status Kepegawaian" value={user.status_kepegawaian || ''} onChange={u('status_kepegawaian')} options={['Tetap', 'DPK', 'PNS']} />
          <FormInput label="Tanggal Mulai Mengajar" value={user.tanggal_mulai_mengajar || ''} onChange={u('tanggal_mulai_mengajar')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="MK Utama" value={user.mk_utama || ''} onChange={u('mk_utama')} />
          <FormInput label="Homebase Prodi" value={user.homebase_prodi || user.jurusan || ''} onChange={u('homebase_prodi')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="Jabatan Struktural" value={user.jabatan_struktural || user.jabatan || ''} onChange={u('jabatan_struktural')} />
          <FormInput label="No SKTP" value={user.no_sktp || ''} onChange={u('no_sktp')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="SK Pertama" value={user.sk_pertama || ''} onChange={u('sk_pertama')} />
          <FormInput label="SK Terakhir" value={user.sk_terakhir || ''} onChange={u('sk_terakhir')} />
        </FieldRow>
      </FormSection>
    </div>
  );
}

function EditDosenPendidikan({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const updateNested = (path: string, field: string, value: string) => {
    const updated = { ...user };
    const keys = path.split('.');
    let current: any = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = { ...current[keys[keys.length - 1]], [field]: value };
    setUser(updated);
  };

  return (
    <div className="space-y-6">
      {(['pendidikan_s1', 'pendidikan_s2', 'pendidikan_s3'] as const).map(path => (
        <div key={path} className="space-y-4">
          <FormSection title={`Pendidikan ${path.split('_')[1].toUpperCase()}`}>
            <FieldRow>
              <FormInput label="Nama Kampus" value={user[path]?.nama_kampus || ''} onChange={(v) => updateNested(path, 'nama_kampus', v)} />
              <FormInput label="Program Studi" value={user[path]?.program_studi || ''} onChange={(v) => updateNested(path, 'program_studi', v)} />
            </FieldRow>
            <FormInput label="Tahun Lulus" value={user[path]?.tahun_lulus || ''} onChange={(v) => updateNested(path, 'tahun_lulus', v)} maxLength={4} />
          </FormSection>
        </div>
      ))}
    </div>
  );
}

function EditDosenSertifikasi({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const u = (f: string) => (v: string) => setUser({ ...user, [f]: v });
  return (
    <div className="space-y-6">
      <FormSection title="Sertifikasi">
        <FieldRow>
          <FormSelect label="Status" value={user.status_sertifikasi || ''} onChange={u('status_sertifikasi')} options={['Ya', 'Tidak']} />
          <FormInput label="Nomor Serdik" value={user.nomor_serdik || ''} onChange={u('nomor_serdik')} />
        </FieldRow>
        <FieldRow>
          <FormInput label="ID SINTA" value={user.id_sinta || ''} onChange={u('id_sinta')} />
          <FormInput label="NRD" value={user.nrd || ''} onChange={u('nrd')} />
        </FieldRow>
      </FormSection>
      <FormSection title="Profil Riset">
        <FormInput label="Google Scholar" value={user.link_google_scholar || ''} onChange={u('link_google_scholar')} />
        <FormTextarea label="Publikasi Riset" value={user.publications || ''} onChange={u('publications')} rows={5} />
      </FormSection>
    </div>
  );
}

// ─── DETAIL DISPLAY COMPONENTS ─────────────────────────────────────────────

function InfoBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-slate-800 truncate">{value || '-'}</p>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6 bg-white border border-slate-100 rounded-2xl space-y-3">
      <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-[10px] text-slate-400 font-medium shrink-0 mr-4">{label}</span>
      <span className="text-xs font-medium text-slate-700 text-right">{value || '-'}</span>
    </div>
  );
}
