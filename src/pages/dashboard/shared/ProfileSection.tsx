import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, 
  GraduationCap, ClipboardList, Layers,
  Save, Loader2, Camera, MessageCircle,
  BookOpen, Globe, Info, ChevronRight, Lock
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { 
  MahasiswaProfile, DosenProfile, UserProfile,
  createDefaultMahasiswaProfile, createDefaultDosenProfile,
  MAHASISWA_TABS, DOSEN_TABS,
  JenisKelamin, Agama, StatusSipil, KelasType, StatusMaba, StatusKelulusan,
  StatusKepegawaian, Golongan, JenjangPendidikan
} from '@/src/types/profiles';

export default function ProfileSection() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !profile) return;
    setSaving(true);

    // Filter hanya kolom yang valid di tabel profiles
    const VALID_COLUMNS = [
      'full_name', 'email', 'role', 'avatar_url',
      // Identitas
      'nim', 'nimko', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
      'agama', 'kewarganegaraan', 'nik', 'nisn', 'no_kk',
      // Kontak
      'alamat_jalan', 'alamat_rt', 'alamat_rw', 'alamat_desa',
      'alamat_kecamatan', 'alamat_kabupaten', 'alamat_provinsi',
      'kode_pos', 'email_mahasiswa', 'no_hp', 'phone', 'status_sipil',
      // Orang Tua
      'nama_kepala_keluarga', 'nama_ayah', 'nik_ayah', 'ttl_ayah',
      'pekerjaan_ayah', 'pendidikan_ayah', 'nama_ibu', 'nik_ibu',
      'ttl_ibu', 'pekerjaan_ibu', 'pendidikan_ibu',
      // Sekolah
      'asal_sekolah', 'tahun_lulus_sekolah', 'jurusan_sekolah',
      // Akademik
      'kode_pt', 'nama_pt', 'program_studi', 'tahun_masuk', 'angkatan',
      'kelas', 'status_maba', 'jalur_pendaftaran', 'gelombang',
      'dpa', 'penerima_kps', 'no_kip', 'status_beasiswa',
      // Kelulusan
      'status_kelulusan', 'judul_skripsi', 'pin_ijazah', 'nirl',
      'no_transkrip', 'no_sk_lulus', 'tanggal_lulus', 'tanggal_ijazah', 'periode_lulus',
      // Dosen Identitas
      'kode_dosen', 'gelar_akademik', 'niy', 'nidn', 'nuptk',
      'nama_ibu_kandung', 'nama_suami_istri', 'email_dosen',
      'alamat_rumah', 'kecamatan', 'kabupaten',
      // Dosen Kepegawaian
      'status_kepegawaian', 'tanggal_mulai_mengajar', 'mk_utama',
      'nama_ptais', 'homebase_prodi', 'jabatan_struktural',
      'sktp', 'no_sktp', 'sk_pertama', 'sk_terakhir',
      // Dosen JSONB
      'pendidikan_s1', 'pendidikan_s2', 'pendidikan_s3',
      'jabfung_pertama', 'jabfung_kedua', 'jabfung_terakhir', 'inpassing',
      // Dosen Sertifikasi
      'status_sertifikasi', 'tanggal_sertifikasi', 'keahlian_sertifikasi',
      'nomor_serdik', 'nrd', 'id_sinta', 'link_google_scholar',
      // Legacy (backward compat)
      'alamat', 'ttl', 'jabatan', 'publications', 'semester',
      'nim_nidn', 'jurusan', 'fakultas', 'nomor_sk_yayasan',
    ];

    const cleanData: Record<string, any> = {};
    VALID_COLUMNS.forEach(col => {
      if (profile[col] !== undefined && profile[col] !== null) {
        cleanData[col] = profile[col];
      }
    });

    const { error } = await supabase
      .from('profiles')
      .update(cleanData)
      .eq('id', userId);

    if (error) {
      toast.error('Gagal memperbarui profil: ' + error.message);
    } else {
      toast.success('Profil berhasil diperbarui');
      localStorage.setItem('user_name', profile.full_name || '');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-sm text-slate-500">Memuat data profil...</p>
    </div>
  );

  const isDosen = profile?.role === 'DOSEN';
  const isMahasiswa = profile?.role === 'MAHASISWA';
  const tabs = isDosen ? DOSEN_TABS : MAHASISWA_TABS;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profil Saya</h1>
          <p className="text-slate-500 font-medium mt-2">Lengkapi biodata Anda untuk keperluan administrasi.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-8 bg-white text-slate-900 border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-3xl">
                  {profile?.full_name?.charAt(0) || <User />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{profile?.full_name || 'BELUM DIISI'}</h3>
                  <p className="text-primary text-xs font-medium mt-1">{profile?.role}</p>
                </div>
                <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Status</p>
                    <p className="text-xs font-bold text-slate-700">Terverifikasi</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Bergabung</p>
                    <p className="text-xs font-bold text-slate-700">{new Date(profile?.created_at).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-2xl space-y-3">
              <div className="flex items-start space-x-3 text-slate-500">
                <Info size={16} className="shrink-0 text-primary mt-0.5" />
                <p className="text-xs leading-relaxed">Pastikan data sesuai dengan KTP dan dokumen resmi.</p>
              </div>
            </div>
          </div>

          {/* Tabbed Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-xs font-medium whitespace-nowrap transition-all border",
                    activeTab === idx 
                      ? "bg-primary text-white border-primary shadow-md" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <span className="mr-2">{idx + 1}.</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="card p-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
              {isMahasiswa && (
                <>
                  {activeTab === 0 && <MahasiswaBiodataTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 1 && <MahasiswaKontakTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 2 && <MahasiswaOrangTuaTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 3 && <MahasiswaAkademikTab profile={profile} setProfile={setProfile} />}
                </>
              )}
              {isDosen && (
                <>
                  {activeTab === 0 && <DosenBiodataTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 1 && <DosenKepegawaianTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 2 && <DosenPendidikanTab profile={profile} setProfile={setProfile} />}
                  {activeTab === 3 && <DosenSertifikasiTab profile={profile} setProfile={setProfile} />}
                </>
              )}
              {!isDosen && !isMahasiswa && (
                <AdminProfileTab profile={profile} setProfile={setProfile} />
              )}

              {/* Save Button */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-primary w-full h-14 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center space-x-2"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : (
                    <>
                      <Save size={18} />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// ─── REUSABLE INPUT COMPONENTS ─────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, readOnly, maxLength }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; readOnly?: boolean; maxLength?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="text"
        className={cn(
          "input-field h-11",
          readOnly && "bg-slate-50 text-slate-600 cursor-not-allowed"
        )}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        maxLength={maxLength}
      />
    </Field>
  );
}

function SelectInput({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <Field label={label}>
      <select 
        className="input-field h-11 appearance-none"
        value={value} 
        onChange={e => onChange(e.target.value)}
      >
        <option value="">{placeholder || `Pilih ${label}`}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </Field>
  );
}

function TextareaInput({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string;
}) {
  return (
    <Field label={label}>
      <textarea
        className="input-field min-h-[80px] py-3"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </Field>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center space-x-2 pb-3 border-b border-slate-100">
      <span className="w-1 h-4 bg-primary rounded-full" />
      <span>{children}</span>
    </h4>
  );
}

// ─── MAHASISWA TABS ────────────────────────────────────────────────────────

function MahasiswaBiodataTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Identitas Pokok</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="NIM" value={profile?.nim || ''} onChange={u('nim')} maxLength={20} />
        <TextInput label="NIMKO" value={profile?.nimko || ''} onChange={u('nimko')} />
        <TextInput label="Nama Lengkap (sesuai Ijazah)" value={profile?.full_name || ''} onChange={u('full_name')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Tempat Lahir" value={profile?.tempat_lahir || ''} onChange={u('tempat_lahir')} />
        <TextInput label="Tanggal Lahir" value={profile?.tanggal_lahir || ''} onChange={u('tanggal_lahir')} placeholder="DD/MM/YYYY" />
        <SelectInput label="Jenis Kelamin" value={profile?.jenis_kelamin || ''} onChange={u('jenis_kelamin')} options={['Laki-laki', 'Perempuan']} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectInput label="Agama" value={profile?.agama || ''} onChange={u('agama')} options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']} />
        <TextInput label="Kewarganegaraan" value={profile?.kewarganegaraan || 'WNI'} onChange={u('kewarganegaraan')} />
        <TextInput label="NIK (16 digit)" value={profile?.nik || ''} onChange={u('nik')} maxLength={16} placeholder="16 digit" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextInput label="NISN" value={profile?.nisn || ''} onChange={u('nisn')} maxLength={10} />
        <TextInput label="No KK" value={profile?.no_kk || ''} onChange={u('no_kk')} maxLength={16} />
      </div>
    </div>
  );
}

function MahasiswaKontakTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Kontak & Domisili</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextInput label="Email Mahasiswa" value={profile?.email_mahasiswa || profile?.email || ''} onChange={u('email_mahasiswa')} placeholder="email@domain.com" />
        <TextInput label="No HP / WhatsApp" value={profile?.no_hp || profile?.phone || ''} onChange={u('no_hp')} placeholder="08xxx" />
      </div>
      <SelectInput label="Status Sipil" value={profile?.status_sipil || ''} onChange={u('status_sipil')} options={['Belum Menikah', 'Sudah Menikah', 'Cerai']} />
      <TextareaInput label="Alamat Jalan" value={profile?.alamat_jalan || profile?.alamat || ''} onChange={u('alamat_jalan')} rows={2} placeholder="Nama Jalan, No. Rumah" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <TextInput label="RT" value={profile?.alamat_rt || ''} onChange={u('alamat_rt')} />
        <TextInput label="RW" value={profile?.alamat_rw || ''} onChange={u('alamat_rw')} />
        <TextInput label="Desa/Kelurahan" value={profile?.alamat_desa || ''} onChange={u('alamat_desa')} />
        <TextInput label="Kecamatan" value={profile?.alamat_kecamatan || ''} onChange={u('alamat_kecamatan')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Kabupaten/Kota" value={profile?.alamat_kabupaten || ''} onChange={u('alamat_kabupaten')} />
        <TextInput label="Provinsi" value={profile?.alamat_provinsi || ''} onChange={u('alamat_provinsi')} />
        <TextInput label="Kode Pos" value={profile?.kode_pos || ''} onChange={u('kode_pos')} maxLength={5} />
      </div>
    </div>
  );
}

function MahasiswaOrangTuaTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Data Orang Tua / Wali</SectionTitle>
      <TextInput label="Nama Kepala Keluarga" value={profile?.nama_kepala_keluarga || ''} onChange={u('nama_kepala_keluarga')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h5 className="text-xs font-semibold text-primary">Data Ayah</h5>
          <TextInput label="Nama Ayah" value={profile?.nama_ayah || ''} onChange={u('nama_ayah')} />
          <TextInput label="NIK Ayah" value={profile?.nik_ayah || ''} onChange={u('nik_ayah')} maxLength={16} />
          <TextInput label="Tanggal Lahir Ayah" value={profile?.ttl_ayah || ''} onChange={u('ttl_ayah')} placeholder="DD/MM/YYYY" />
          <TextInput label="Pekerjaan Ayah" value={profile?.pekerjaan_ayah || ''} onChange={u('pekerjaan_ayah')} />
          <SelectInput label="Pendidikan Terakhir Ayah" value={profile?.pendidikan_ayah || ''} onChange={u('pendidikan_ayah')} options={['S1', 'S2', 'S3', 'SMA', 'SMK', 'MA', 'SMP']} />
        </div>
        <div className="space-y-5">
          <h5 className="text-xs font-semibold text-primary">Data Ibu</h5>
          <TextInput label="Nama Ibu Kandung" value={profile?.nama_ibu || ''} onChange={u('nama_ibu')} />
          <TextInput label="NIK Ibu" value={profile?.nik_ibu || ''} onChange={u('nik_ibu')} maxLength={16} />
          <TextInput label="Tanggal Lahir Ibu" value={profile?.ttl_ibu || ''} onChange={u('ttl_ibu')} placeholder="DD/MM/YYYY" />
          <TextInput label="Pekerjaan Ibu" value={profile?.pekerjaan_ibu || ''} onChange={u('pekerjaan_ibu')} />
          <SelectInput label="Pendidikan Terakhir Ibu" value={profile?.pendidikan_ibu || ''} onChange={u('pendidikan_ibu')} options={['S1', 'S2', 'S3', 'SMA', 'SMK', 'MA', 'SMP']} />
        </div>
      </div>

      <SectionTitle>Pendidikan Sebelumnya</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Asal MA/SMA/SMK" value={profile?.asal_sekolah || ''} onChange={u('asal_sekolah')} />
        <TextInput label="Tahun Lulus" value={profile?.tahun_lulus_sekolah || ''} onChange={u('tahun_lulus_sekolah')} maxLength={4} />
        <TextInput label="Jurusan Sekolah" value={profile?.jurusan_sekolah || ''} onChange={u('jurusan_sekolah')} />
      </div>
    </div>
  );
}

function MahasiswaAkademikTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Data Akademik & Kampus</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Program Studi" value={profile?.program_studi || profile?.jurusan || ''} onChange={u('program_studi')} />
        <TextInput label="Tahun Masuk / Angkatan" value={profile?.angkatan || profile?.tahun_masuk || ''} onChange={u('angkatan')} maxLength={4} />
        <SelectInput label="Kelas" value={profile?.kelas || ''} onChange={u('kelas')} options={['Reguler', 'Non Reguler']} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectInput label="Status Maba" value={profile?.status_maba || ''} onChange={u('status_maba')} options={['Baru', 'Transfer']} />
        <TextInput label="Jalur Pendaftaran" value={profile?.jalur_pendaftaran || ''} onChange={u('jalur_pendaftaran')} />
        <TextInput label="Gelombang" value={profile?.gelombang || ''} onChange={u('gelombang')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextInput label="Dosen Pembimbing Akademik (DPA)" value={profile?.dpa || ''} onChange={u('dpa')} />
        <SelectInput label="Penerima KPS/KIP" value={profile?.penerima_kps || ''} onChange={u('penerima_kps')} options={['Ya', 'Tidak']} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextInput label="No KIP" value={profile?.no_kip || ''} onChange={u('no_kip')} />
        <TextInput label="Status Beasiswa" value={profile?.status_beasiswa || ''} onChange={u('status_beasiswa')} />
      </div>

      <SectionTitle> Kelulusan & Tugas Akhir (Read-Only Admin)</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectInput label="Status Kelulusan" value={profile?.status_kelulusan || 'Aktif'} onChange={u('status_kelulusan')} options={['Aktif', 'Lulus', 'DO', 'Mengundurkan Diri']} />
        <TextInput label="Judul Skripsi" value={profile?.judul_skripsi || ''} onChange={u('judul_skripsi')} />
        <TextInput label="PIN Ijazah / No Ijazah" value={profile?.pin_ijazah || ''} onChange={u('pin_ijazah')} readOnly />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="NIRL" value={profile?.nirl || ''} onChange={u('nirl')} readOnly />
        <TextInput label="No Transkrip" value={profile?.no_transkrip || ''} onChange={u('no_transkrip')} readOnly />
        <TextInput label="No SK Lulus" value={profile?.no_sk_lulus || ''} onChange={u('no_sk_lulus')} readOnly />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Tanggal Lulus" value={profile?.tanggal_lulus || ''} onChange={u('tanggal_lulus')} readOnly />
        <TextInput label="Tanggal Ijazah" value={profile?.tanggal_ijazah || ''} onChange={u('tanggal_ijazah')} readOnly />
        <TextInput label="Periode Lulus" value={profile?.periode_lulus || ''} onChange={u('periode_lulus')} readOnly />
      </div>
    </div>
  );
}

// ─── DOSEN TABS ────────────────────────────────────────────────────────────

function DosenBiodataTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Identitas Pokok</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Kode Dosen" value={profile?.kode_dosen || ''} onChange={u('kode_dosen')} />
        <TextInput label="Nama Lengkap" value={profile?.full_name || ''} onChange={u('full_name')} />
        <TextInput label="Gelar Akademik" value={profile?.gelar_akademik || ''} onChange={u('gelar_akademik')} placeholder="M.Pd., Ph.D." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="NIY" value={profile?.niy || ''} onChange={u('niy')} />
        <TextInput label="NIDN" value={profile?.nidn || ''} onChange={u('nidn')} />
        <TextInput label="NUPTK" value={profile?.nuptk || ''} onChange={u('nuptk')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="NIK" value={profile?.nik || ''} onChange={u('nik')} maxLength={16} />
        <TextInput label="No KK" value={profile?.no_kk || ''} onChange={u('no_kk')} maxLength={16} />
        <SelectInput label="Jenis Kelamin" value={profile?.jenis_kelamin || ''} onChange={u('jenis_kelamin')} options={['Laki-laki', 'Perempuan']} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Tempat Lahir" value={profile?.tempat_lahir || ''} onChange={u('tempat_lahir')} />
        <TextInput label="Tanggal Lahir" value={profile?.tanggal_lahir || ''} onChange={u('tanggal_lahir')} placeholder="DD/MM/YYYY" />
        <TextInput label="Nama Ibu Kandung" value={profile?.nama_ibu_kandung || ''} onChange={u('nama_ibu_kandung')} />
      </div>
      <TextInput label="Nama Suami/Istri" value={profile?.nama_suami_istri || ''} onChange={u('nama_suami_istri')} />

      <SectionTitle>Kontak</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextInput label="No HP / WhatsApp" value={profile?.no_hp || profile?.phone || ''} onChange={u('no_hp')} />
        <TextInput label="Email" value={profile?.email_dosen || profile?.email || ''} onChange={u('email_dosen')} placeholder="email@domain.com" />
      </div>
      <TextareaInput label="Alamat Rumah" value={profile?.alamat_rumah || profile?.alamat || ''} onChange={u('alamat_rumah')} rows={2} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <TextInput label="Kode Pos" value={profile?.kode_pos || ''} onChange={u('kode_pos')} maxLength={5} />
        <TextInput label="Kecamatan" value={profile?.kecamatan || ''} onChange={u('kecamatan')} />
        <TextInput label="Kabupaten/Kota" value={profile?.kabupaten || ''} onChange={u('kabupaten')} />
        <TextInput label="Fakultas" value={profile?.fakultas || ''} onChange={u('fakultas')} />
      </div>
    </div>
  );
}

function DosenKepegawaianTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Kepegawaian & Homebase</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectInput label="Status Kepegawaian" value={profile?.status_kepegawaian || ''} onChange={u('status_kepegawaian')} options={['Tetap', 'DPK', 'PNS']} />
        <TextInput label="Tanggal Mulai Mengajar" value={profile?.tanggal_mulai_mengajar || ''} onChange={u('tanggal_mulai_mengajar')} placeholder="DD/MM/YYYY" />
        <TextInput label="MK Utama" value={profile?.mk_utama || ''} onChange={u('mk_utama')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Nama PTAIS" value={profile?.nama_ptais || 'STAI Ihyaul Ulum Gresik'} onChange={u('nama_ptais')} />
        <TextInput label="Homebase Prodi" value={profile?.homebase_prodi || profile?.jurusan || ''} onChange={u('homebase_prodi')} />
        <TextInput label="Jabatan Struktural" value={profile?.jabatan_struktural || profile?.jabatan || ''} onChange={u('jabatan_struktural')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="SKTP" value={profile?.sktp || ''} onChange={u('sktp')} />
        <TextInput label="No SKTP" value={profile?.no_sktp || ''} onChange={u('no_sktp')} />
        <TextInput label="SK Pertama" value={profile?.sk_pertama || ''} onChange={u('sk_pertama')} />
      </div>
      <TextInput label="SK Terakhir" value={profile?.sk_terakhir || ''} onChange={u('sk_terakhir')} />
    </div>
  );
}

function DosenPendidikanTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const updateNested = (path: string, field: string, value: string) => {
    const keys = path.split('.');
    const updated = { ...profile };
    let current: any = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = { ...current[keys[keys.length - 1]], [field]: value };
    setProfile(updated);
  };

  const pendidikanFields = [
    { label: 'S1', path: 'pendidikan_s1' },
    { label: 'S2', path: 'pendidikan_s2' },
    { label: 'S3', path: 'pendidikan_s3' },
  ];

  const jabfungFields = [
    { label: 'Jabfung Pertama', path: 'jabfung_pertama' },
    { label: 'Jabfung Kedua', path: 'jabfung_kedua' },
    { label: 'Jabfung Terakhir', path: 'jabfung_terakhir' },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle>Riwayat Pendidikan Formal</SectionTitle>
      {pendidikanFields.map(({ label, path }) => (
        <div key={path} className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
          <h5 className="text-sm font-semibold text-slate-700">{label}</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput label="Nama Kampus" value={profile?.[path]?.nama_kampus || ''} onChange={(v) => updateNested(path, 'nama_kampus', v)} />
            <TextInput label="Program Studi" value={profile?.[path]?.program_studi || ''} onChange={(v) => updateNested(path, 'program_studi', v)} />
            <TextInput label="Tahun Lulus" value={profile?.[path]?.tahun_lulus || ''} onChange={(v) => updateNested(path, 'tahun_lulus', v)} maxLength={4} />
          </div>
        </div>
      ))}

      <SectionTitle>Riwayat Jabatan Fungsional</SectionTitle>
      {jabfungFields.map(({ label, path }) => (
        <div key={path} className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
          <h5 className="text-sm font-semibold text-slate-700">{label}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Jabatan Fungsional" value={profile?.[path]?.jabatan_fungsional || ''} onChange={(v) => updateNested(path, 'jabatan_fungsional', v)} />
            <TextInput label="Pangkat" value={profile?.[path]?.pangkat || ''} onChange={(v) => updateNested(path, 'pangkat', v)} />
            <TextInput label="Golongan" value={profile?.[path]?.golongan || ''} onChange={(v) => updateNested(path, 'golongan', v)} />
            <TextInput label="No SK" value={profile?.[path]?.no_sk || ''} onChange={(v) => updateNested(path, 'no_sk', v)} />
            <TextInput label="Tanggal SK" value={profile?.[path]?.tanggal_sk || ''} onChange={(v) => updateNested(path, 'tanggal_sk', v)} placeholder="DD/MM/YYYY" />
          </div>
        </div>
      ))}

      <SectionTitle>Riwayat Inpassing (DPK/PNS)</SectionTitle>
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
        <TextInput label="Inpassing Pangkat Awal" value={profile?.inpassing?.pangkat_awal || ''} onChange={(v) => {
          const updated = { ...profile, inpassing: { ...profile.inpassing, pangkat_awal: v } };
          setProfile(updated);
        }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['kenaikan_gol_iiic', 'kenaikan_gol_iiid'] as const).map(key => (
            <div key={key} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <h6 className="text-xs font-semibold text-primary">{key === 'kenaikan_gol_iiic' ? 'Kenaikan Gol III/c' : 'Kenaikan Gol III/d'}</h6>
              {(['pangkat', 'golongan', 'no_sk', 'tanggal_sk'] as const).map(field => (
                <div key={field}>
                  <TextInput label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={profile?.inpassing?.[key]?.[field] || ''}
                    onChange={(v) => {
                      const updated = { ...profile, inpassing: { ...profile.inpassing, [key]: { ...profile.inpassing?.[key], [field]: v } } };
                      setProfile(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DosenSertifikasiTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Sertifikasi Dosen</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectInput label="Status Sertifikasi" value={profile?.status_sertifikasi || ''} onChange={u('status_sertifikasi')} options={['Ya', 'Tidak']} />
        <TextInput label="Tanggal Sertifikasi" value={profile?.tanggal_sertifikasi || ''} onChange={u('tanggal_sertifikasi')} placeholder="DD/MM/YYYY" />
        <TextInput label="Keahlian Sertifikasi" value={profile?.keahlian_sertifikasi || ''} onChange={u('keahlian_sertifikasi')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TextInput label="Nomor Serdik" value={profile?.nomor_serdik || ''} onChange={u('nomor_serdik')} />
        <TextInput label="NRD" value={profile?.nrd || ''} onChange={u('nrd')} />
        <TextInput label="ID SINTA" value={profile?.id_sinta || ''} onChange={u('id_sinta')} placeholder="https://sinta.kemdikbud.go.id/..." />
      </div>

      <SectionTitle>Profil Riset</SectionTitle>
      <TextInput label="Link Google Scholar" value={profile?.link_google_scholar || ''} onChange={u('link_google_scholar')} placeholder="https://scholar.google.com/..." />
      <TextareaInput label="Katalog Publikasi Riset" value={profile?.publications || ''} onChange={u('publications')} rows={6} placeholder="Daftar jurnal, buku, prosiding..." />
    </div>
  );
}

// ─── ADMIN PROFILE TAB ─────────────────────────────────────────────────────

function AdminProfileTab({ profile, setProfile }: { profile: any; setProfile: (p: any) => void }) {
  const u = (field: string) => (v: string) => setProfile({ ...profile, [field]: v });

  return (
    <div className="space-y-8">
      <SectionTitle>Biodata Admin</SectionTitle>
      <TextInput label="Nama Lengkap" value={profile?.full_name || ''} onChange={u('full_name')} />
      <TextInput label="Email" value={profile?.email || ''} onChange={u('email')} />
    </div>
  );
}
