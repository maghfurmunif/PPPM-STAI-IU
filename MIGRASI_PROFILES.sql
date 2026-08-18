-- ============================================================
-- MIGRASI: Menambahkan semua kolom profil lengkap ke tabel profiles
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- ─── 1. IDENTITAS POKOK (Mahasiswa & Dosen) ─────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nim TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nimko TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tempat_lahir TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tanggal_lahir TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jenis_kelamin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agama TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kewarganegaraan TEXT DEFAULT 'WNI';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nik TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nisn TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_kk TEXT;

-- ─── 2. KONTAK & DOMISILI ───────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_jalan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_rt TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_rw TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_desa TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_kecamatan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_kabupaten TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_provinsi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kode_pos TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_mahasiswa TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_hp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_sipil TEXT;

-- ─── 3. DATA ORANG TUA / WALI ───────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_kepala_keluarga TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_ayah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nik_ayah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ttl_ayah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pekerjaan_ayah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pendidikan_ayah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_ibu TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nik_ibu TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ttl_ibu TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pekerjaan_ibu TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pendidikan_ibu TEXT;

-- ─── 4. PENDIDIKAN SEBELUMNYA ───────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS asal_sekolah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tahun_lulus_sekolah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jurusan_sekolah TEXT;

-- ─── 5. AKADEMIK & KAMPUS ───────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kode_pt TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_pt TEXT DEFAULT 'STAI Ihyaul Ulum Gresik';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS program_studi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tahun_masuk TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS angkatan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kelas TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_maba TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jalur_pendaftaran TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gelombang TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dpa TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS penerima_kps TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_kip TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_beasiswa TEXT;

-- ─── 6. KELULUSAN & TUGAS AKHIR ─────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_kelulusan TEXT DEFAULT 'Aktif';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS judul_skripsi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pin_ijazah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nirl TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_transkrip TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_sk_lulus TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tanggal_lulus TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tanggal_ijazah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS periode_lulus TEXT;

-- ─── 7. DOSEN: IDENTITAS & KONTAK ───────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kode_dosen TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gelar_akademik TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS niy TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nidn TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nuptk TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_ibu_kandung TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_suami_istri TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_dosen TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat_rumah TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kecamatan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kabupaten TEXT;

-- ─── 8. DOSEN: KEPEGAWAIAN & HOMEBASE ───────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_kepegawaian TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tanggal_mulai_mengajar TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mk_utama TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nama_ptais TEXT DEFAULT 'STAI Ihyaul Ulum Gresik';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS homebase_prodi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabatan_struktural TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sktp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS no_sktp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sk_pertama TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sk_terakhir TEXT;

-- ─── 9. DOSEN: RIWAYAT PENDIDIKAN FORMAL (JSONB) ───────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pendidikan_s1 JSONB DEFAULT '{"jenjang":"S1","nama_kampus":"","program_studi":"","tahun_lulus":""}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pendidikan_s2 JSONB DEFAULT '{"jenjang":"S2","nama_kampus":"","program_studi":"","tahun_lulus":""}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pendidikan_s3 JSONB DEFAULT '{"jenjang":"S3","nama_kampus":"","program_studi":"","tahun_lulus":""}'::jsonb;

-- ─── 10. DOSEN: RIWAYAT JABFUNG (JSONB) ─────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabfung_pertama JSONB DEFAULT '{"jabatan_fungsional":"","pangkat":"","golongan":"","no_sk":"","tanggal_sk":""}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabfung_kedua JSONB DEFAULT '{"jabatan_fungsional":"","pangkat":"","golongan":"","no_sk":"","tanggal_sk":""}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabfung_terakhir JSONB DEFAULT '{"jabatan_fungsional":"","pangkat":"","golongan":"","no_sk":"","tanggal_sk":""}'::jsonb;

-- ─── 11. DOSEN: RIWAYAT INPASSING (JSONB) ───────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS inpassing JSONB DEFAULT '{"pangkat_awal":"","kenaikan_gol_iiic":{"pangkat":"","golongan":"","no_sk":"","tanggal_sk":""},"kenaikan_gol_iiid":{"pangkat":"","golongan":"","no_sk":"","tanggal_sk":""}}'::jsonb;

-- ─── 12. DOSEN: SERTIFIKASI & RISET ─────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_sertifikasi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tanggal_sertifikasi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS keahlian_sertifikasi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nomor_serdik TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nrd TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_sinta TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS link_google_scholar TEXT;

-- ─── 13. FIELD LAMA (backward compatibility) ────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alamat TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ttl TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabatan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS publications TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester INTEGER;

-- ─── SELESAI ─────────────────────────────────────────────────
-- Verifikasi kolom yang sudah ditambahkan:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'profiles' ORDER BY ordinal_position;
