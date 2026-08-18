-- ============================================================
-- MIGRASI: Menambahkan kolom sk_penerima_bantuan_file ke tabel penelitian_registrations
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Tambah kolom SK Penerima Bantuan Penelitian (file yang diunggah Admin saat approve bukti sempro)
ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS sk_penerima_bantuan_file TEXT;

-- Verifikasi
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'penelitian_registrations' 
AND column_name = 'sk_penerima_bantuan_file';
