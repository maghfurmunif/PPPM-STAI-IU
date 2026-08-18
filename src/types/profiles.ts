/**
 * Profile types matching STAI Ihyaul Ulum Gresik Excel data structure
 */

export type UserRole = 'MAHASISWA' | 'DOSEN' | 'ADMIN';

// ─── ENUMS ────────────────────────────────────────────────────────────────

export type JenisKelamin = 'Laki-laki' | 'Perempuan';
export type Agama = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
export type StatusSipil = 'Belum Menikah' | 'Sudah Menikah' | 'Cerai';
export type StatusMaba = 'Baru' | 'Transfer';
export type StatusKelulusan = 'Aktif' | 'Lulus' | 'DO' | 'Mengundurkan Diri';
export type KelasType = 'Reguler' | 'Non Reguler';
export type StatusKPS = 'Ya' | 'Tidak';
export type StatusKepegawaian = 'Tetap' | 'DPK' | 'PNS';
export type JenjangPendidikan = 'S1' | 'S2' | 'S3' | 'SMA' | 'SMK' | 'MA' | 'SMP';
export type Golongan = 'III/a' | 'III/b' | 'III/c' | 'III/d' | 'IV/a' | 'IV/b' | 'IV/c' | 'IV/d' | 'IV/e';
export type Platform = 'REPOSITORY' | 'SISTER' | 'SINTA' | 'LAIN';

// ─── MAHASISWA PROFILE ────────────────────────────────────────────────────

export interface MahasiswaProfile {
  id: string;
  role: 'MAHASISWA';
  email: string;
  created_at: string;

  // 1. Identitas Pokok
  nim: string;
  nimko: string;
  full_name: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: JenisKelamin | '';
  agama: Agama | '';
  kewarganegaraan: string;
  nik: string;
  nisn: string;
  no_kk: string;

  // 2. Kontak & Domisili
  alamat_jalan: string;
  alamat_rt: string;
  alamat_rw: string;
  alamat_desa: string;
  alamat_kecamatan: string;
  alamat_kabupaten: string;
  alamat_provinsi: string;
  kode_pos: string;
  email_mahasiswa: string;
  no_hp: string;
  status_sipil: StatusSipil | '';

  // 3. Data Orang Tua / Wali
  nama_kepala_keluarga: string;
  nama_ayah: string;
  nik_ayah: string;
  ttl_ayah: string;
  pekerjaan_ayah: string;
  pendidikan_ayah: JenjangPendidikan | '';
  nama_ibu: string;
  nik_ibu: string;
  ttl_ibu: string;
  pekerjaan_ibu: string;
  pendidikan_ibu: JenjangPendidikan | '';

  // 4. Pendidikan Sebelumnya
  asal_sekolah: string;
  tahun_lulus_sekolah: string;
  jurusan_sekolah: string;

  // 5. Akademik & Kampus
  kode_pt: string;
  nama_pt: string;
  program_studi: string;
  tahun_masuk: string;
  angkatan: string;
  kelas: KelasType | '';
  status_maba: StatusMaba | '';
  jalur_pendaftaran: string;
  gelombang: string;
  dpa: string;
  penerima_kps: StatusKPS | '';
  no_kip: string;
  status_beasiswa: string;

  // 6. Kelulusan & Tugas Akhir
  status_kelulusan: StatusKelulusan | '';
  judul_skripsi: string;
  pin_ijazah: string;
  nirl: string;
  no_transkrip: string;
  no_sk_lulus: string;
  tanggal_lulus: string;
  tanggal_ijazah: string;
  periode_lulus: string;

  // Computed / display fields
  semester: string;
  fakultas: string;
  jurusan: string;
  phone: string;
  full_address: string;
}

// ─── DOSEN PROFILE ────────────────────────────────────────────────────────

export interface RiwayatPendidikan {
  jenjang: 'S1' | 'S2' | 'S3';
  nama_kampus: string;
  program_studi: string;
  tahun_lulus: string;
}

export interface RiwayatJabfung {
  jabatan_fungsional: string;
  pangkat: string;
  golongan: Golongan | '';
  no_sk: string;
  tanggal_sk: string;
}

export interface RiwayatInpassing {
  pangkat_awal: string;
  kenaikan_gol_iiic: {
    pangkat: string;
    golongan: string;
    no_sk: string;
    tanggal_sk: string;
  };
  kenaikan_gol_iiid: {
    pangkat: string;
    golongan: string;
    no_sk: string;
    tanggal_sk: string;
  };
}

export interface DosenProfile {
  id: string;
  role: 'DOSEN';
  email: string;
  created_at: string;

  // 1. Identitas Pokok & Kontak
  kode_dosen: string;
  full_name: string;
  gelar_akademik: string;
  niy: string;
  nidn: string;
  nuptk: string;
  nik: string;
  no_kk: string;
  jenis_kelamin: JenisKelamin | '';
  tempat_lahir: string;
  tanggal_lahir: string;
  nama_ibu_kandung: string;
  nama_suami_istri: string;
  no_hp: string;
  alamat_rumah: string;
  kode_pos: string;
  kecamatan: string;
  kabupaten: string;
  email_dosen: string;

  // 2. Kepegawaian & Homebase
  status_kepegawaian: StatusKepegawaian | '';
  tanggal_mulai_mengajar: string;
  mk_utama: string;
  nama_ptais: string;
  homebase_prodi: string;
  jabatan_struktural: string;
  sktp: string;
  no_sktp: string;
  sk_pertama: string;
  sk_terakhir: string;

  // 3. Riwayat Pendidikan Formal
  pendidikan_s1: RiwayatPendidikan;
  pendidikan_s2: RiwayatPendidikan;
  pendidikan_s3: RiwayatPendidikan;

  // 4. Riwayat Jabfung
  jabfung_pertama: RiwayatJabfung;
  jabfung_kedua: RiwayatJabfung;
  jabfung_terakhir: RiwayatJabfung;

  // 5. Riwayat Inpassing
  inpassing: RiwayatInpassing;

  // 6. Sertifikasi & Identitas Riset
  status_sertifikasi: StatusKPS | '';
  tanggal_sertifikasi: string;
  keahlian_sertifikasi: string;
  nomor_serdik: string;
  nrd: string;
  id_sinta: string;
  link_google_scholar: string;

  // Computed / display fields
  publications: string;
  jabatan: string;
  fakultas: string;
  jurusan: string;
}

// ─── UNION TYPE ────────────────────────────────────────────────────────────

export type UserProfile = MahasiswaProfile | DosenProfile | AdminProfile;

export interface AdminProfile {
  id: string;
  role: 'ADMIN';
  email: string;
  full_name: string;
  created_at: string;
}

// ─── TAB CONFIGURATION ─────────────────────────────────────────────────────

export interface TabConfig {
  id: string;
  label: string;
  icon?: any;
}

export const MAHASISWA_TABS: TabConfig[] = [
  { id: 'biodata', label: 'Biodata & Identitas', icon: null },
  { id: 'kontak', label: 'Kontak & Alamat', icon: null },
  { id: 'orangtua', label: 'Orang Tua & Asal Sekolah', icon: null },
  { id: 'akademik', label: 'Akademik & Kelulusan', icon: null },
];

export const DOSEN_TABS: TabConfig[] = [
  { id: 'pribadi', label: 'Biodata Pribadi & Kontak', icon: null },
  { id: 'kepegawaian', label: 'Kepegawaian & Homebase', icon: null },
  { id: 'pendidikan', label: 'Pendidikan & Jabfung', icon: null },
  { id: 'sertifikasi', label: 'Sertifikasi & Riset', icon: null },
];

// ─── DEFAULT VALUES ────────────────────────────────────────────────────────

export function createDefaultMahasiswaProfile(overrides?: Partial<MahasiswaProfile>): MahasiswaProfile {
  return {
    id: '',
    role: 'MAHASISWA',
    email: '',
    created_at: new Date().toISOString(),
    nim: '', nimko: '', full_name: '',
    tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: '', agama: '', kewarganegaraan: 'WNI',
    nik: '', nisn: '', no_kk: '',
    alamat_jalan: '', alamat_rt: '', alamat_rw: '',
    alamat_desa: '', alamat_kecamatan: '', alamat_kabupaten: '',
    alamat_provinsi: '', kode_pos: '', email_mahasiswa: '',
    no_hp: '', status_sipil: '',
    nama_kepala_keluarga: '', nama_ayah: '', nik_ayah: '',
    ttl_ayah: '', pekerjaan_ayah: '', pendidikan_ayah: '',
    nama_ibu: '', nik_ibu: '', ttl_ibu: '',
    pekerjaan_ibu: '', pendidikan_ibu: '',
    asal_sekolah: '', tahun_lulus_sekolah: '', jurusan_sekolah: '',
    kode_pt: '', nama_pt: 'STAI Ihyaul Ulum Gresik',
    program_studi: '', tahun_masuk: '', angkatan: '',
    kelas: '', status_maba: '', jalur_pendaftaran: '',
    gelombang: '', dpa: '', penerima_kps: '', no_kip: '',
    status_beasiswa: '',
    status_kelulusan: 'Aktif', judul_skripsi: '', pin_ijazah: '',
    nirl: '', no_transkrip: '', no_sk_lulus: '',
    tanggal_lulus: '', tanggal_ijazah: '', periode_lulus: '',
    semester: '', fakultas: '', jurusan: '', phone: '',
    full_address: '',
    ...overrides,
  };
}

export function createDefaultDosenProfile(overrides?: Partial<DosenProfile>): DosenProfile {
  const emptyPendidikan: RiwayatPendidikan = { jenjang: 'S1', nama_kampus: '', program_studi: '', tahun_lulus: '' };
  const emptyJabfung: RiwayatJabfung = { jabatan_fungsional: '', pangkat: '', golongan: '', no_sk: '', tanggal_sk: '' };
  const emptyInpassing: RiwayatInpassing = {
    pangkat_awal: '',
    kenaikan_gol_iiic: { pangkat: '', golongan: '', no_sk: '', tanggal_sk: '' },
    kenaikan_gol_iiid: { pangkat: '', golongan: '', no_sk: '', tanggal_sk: '' },
  };

  return {
    id: '',
    role: 'DOSEN',
    email: '',
    created_at: new Date().toISOString(),
    kode_dosen: '', full_name: '', gelar_akademik: '',
    niy: '', nidn: '', nuptk: '', nik: '', no_kk: '',
    jenis_kelamin: '', tempat_lahir: '', tanggal_lahir: '',
    nama_ibu_kandung: '', nama_suami_istri: '',
    no_hp: '', alamat_rumah: '', kode_pos: '',
    kecamatan: '', kabupaten: '', email_dosen: '',
    status_kepegawaian: '', tanggal_mulai_mengajar: '',
    mk_utama: '', nama_ptais: '', homebase_prodi: '',
    jabatan_struktural: '', sktp: '', no_sktp: '',
    sk_pertama: '', sk_terakhir: '',
    pendidikan_s1: { ...emptyPendidikan },
    pendidikan_s2: { ...emptyPendidikan, jenjang: 'S2' },
    pendidikan_s3: { ...emptyPendidikan, jenjang: 'S3' },
    jabfung_pertama: { ...emptyJabfung },
    jabfung_kedua: { ...emptyJabfung },
    jabfung_terakhir: { ...emptyJabfung },
    inpassing: emptyInpassing,
    status_sertifikasi: '', tanggal_sertifikasi: '',
    keahlian_sertifikasi: '', nomor_serdik: '', nrd: '',
    id_sinta: '', link_google_scholar: '',
    publications: '', jabatan: '', fakultas: '', jurusan: '',
    ...overrides,
  };
}
