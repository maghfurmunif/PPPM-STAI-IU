-- ============================================================
-- MIGRASI: Public read policies + photo upload rules
-- STAI Ihyaul Ulum Gresik - PPPM Webapp
-- Jalankan di Supabase SQL Editor
-- Aman dijalankan berulang kali (DROP IF EXISTS lalu CREATE)
-- ============================================================

-- 1. dosen_dokumentasi
DROP POLICY IF EXISTS "Public can view Dokumentasi" ON public.dosen_dokumentasi;
CREATE POLICY "Public can view Dokumentasi" 
  ON public.dosen_dokumentasi FOR SELECT 
  USING (true);

-- 2. penelitian_registrations
DROP POLICY IF EXISTS "Public can view Penelitian" ON public.penelitian_registrations;
CREATE POLICY "Public can view Penelitian" 
  ON public.penelitian_registrations FOR SELECT 
  USING (true);

-- 3. pengabdian_registrations
DROP POLICY IF EXISTS "Public can view Pengabdian" ON public.pengabdian_registrations;
CREATE POLICY "Public can view Pengabdian" 
  ON public.pengabdian_registrations FOR SELECT 
  USING (true);

-- 4. kkn_registrations
DROP POLICY IF EXISTS "Public can view KKN" ON public.kkn_registrations;
CREATE POLICY "Public can view KKN" 
  ON public.kkn_registrations FOR SELECT 
  USING (true);

-- 5. sempro_registrations
DROP POLICY IF EXISTS "Public can view Sempro" ON public.sempro_registrations;
CREATE POLICY "Public can view Sempro" 
  ON public.sempro_registrations FOR SELECT 
  USING (true);

-- 6. skripsi_registrations
DROP POLICY IF EXISTS "Public can view Skripsi" ON public.skripsi_registrations;
CREATE POLICY "Public can view Skripsi" 
  ON public.skripsi_registrations FOR SELECT 
  USING (true);

-- 7. profiles — photo_url column (if not yet added)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 8. profiles — update policy: hanya admin & user sendiri yang bisa update photo_url
-- Drop existing update policy lalu recreate dengan aturan lebih ketat
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 9. Admin tetap bisa manage semua profiles (termasuk photo_url)
-- Policy "Admins manage all profiles" sudah ada, tidak perlu dibuat ulang
