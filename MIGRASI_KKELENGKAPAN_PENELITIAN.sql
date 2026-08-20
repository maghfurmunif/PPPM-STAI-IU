-- ============================================================
-- MIGRASI: Menambahkan kolom metadata penelitian untuk tracking kelengkapan data
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Tambah kolom metadata penelitian
ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS judul_penelitian TEXT;

ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS co_authors TEXT;

ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS skema TEXT DEFAULT '';

ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS tahun_penelitian TEXT DEFAULT '';

ALTER TABLE public.penelitian_registrations 
ADD COLUMN IF NOT EXISTS jenis_karya TEXT DEFAULT 'Penelitian';

-- 2. Verifikasi
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'penelitian_registrations'
ORDER BY ordinal_position;
