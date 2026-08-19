-- ============================================================
-- MIGRASI: Fix statistik publik & upload foto
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Public read policy untuk dosen_dokumentasi (agar statistik tampil tanpa login)
CREATE POLICY "Public can view Dokumentasi" 
  ON public.dosen_dokumentasi FOR SELECT 
  USING (true);

-- 2. Kolom photo_url untuk foto profil peneliti
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
