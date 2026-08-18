-- ============================================================
-- MIGRASI: Dosen dapat melakukan lebih dari 1 penelitian
-- Jalankan file ini SEKALI di Supabase SQL Editor.
-- ============================================================

-- 1) Hapus constraint UNIQUE (dosen_id) bila ada
ALTER TABLE public.penelitian_registrations
    DROP CONSTRAINT IF EXISTS penelitian_registrations_dosen_id_key;

-- 2) Hapus SEMUA unique index pada dosen_id (nama bisa bervariasi,
--    mis. penelitian_registrations_dosen_id_key / _idx / lainnya).
DO $$
DECLARE
    idx RECORD;
BEGIN
    FOR idx IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'penelitian_registrations'
          AND indexdef ILIKE '%UNIQUE%'
          AND indexdef ILIKE '%dosen_id%'
    LOOP
        EXECUTE format('DROP INDEX IF EXISTS public.%I', idx.indexname);
    END LOOP;
END $$;

-- 3) (Opsional) Pastikan ada index NON-unique untuk lookup cepat per dosen
CREATE INDEX IF NOT EXISTS idx_penelitian_registrations_dosen_id
    ON public.penelitian_registrations (dosen_id);
