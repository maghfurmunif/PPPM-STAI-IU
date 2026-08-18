-- ============================================================
-- MIGRASI: Menambahkan kolom sk_reviewer_file ke tabel penelitian_registrations
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Tambah kolom SK Reviuwer (file yang diunggah Admin saat approval proposal)
ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS sk_reviewer_file TEXT;

-- Verifikasi
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'penelitian_registrations' 
AND column_name = 'sk_reviewer_file';
