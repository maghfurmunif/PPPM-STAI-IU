-- Migration: Add platform_rank and article_url to dosen_dokumentasi
-- Run this in Supabase SQL Editor

-- Add platform_rank column (e.g., S1-S6 for SINTA, Q1-Q4 for SCOPUS)
ALTER TABLE IF EXISTS public.dosen_dokumentasi 
ADD COLUMN IF NOT EXISTS platform_rank TEXT;

-- Add article_url column (link to online article)
ALTER TABLE IF EXISTS public.dosen_dokumentasi 
ADD COLUMN IF NOT EXISTS article_url TEXT;
