-- =============================================================================
-- ClinGene News & Blog Posts Tables & RLS Policies Setup
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/vardexszujcvrepiguvu/sql
-- =============================================================================

-- 1. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    image_alt TEXT,
    publish_date DATE,
    author TEXT,
    tags TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting existing policies on blog_posts
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated full access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anon full access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users full access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anon all operations on blog_posts" ON public.blog_posts;

-- Re-create clean policies
CREATE POLICY "Allow public read access to published blogs" 
ON public.blog_posts FOR SELECT 
USING (status IS NULL OR LOWER(status) = 'published');

CREATE POLICY "Allow authenticated full access to blog_posts" 
ON public.blog_posts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anon full access to blog_posts" 
ON public.blog_posts FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);


-- 2. NEWS POSTS TABLE
CREATE TABLE IF NOT EXISTS public.news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    image_alt TEXT,
    publish_date DATE,
    source TEXT,
    event_date DATE,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on news_posts
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting existing policies on news_posts
DROP POLICY IF EXISTS "Allow public read access to published news" ON public.news_posts;
DROP POLICY IF EXISTS "Allow authenticated full access to news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "Allow anon full access to news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "Allow authenticated users full access to news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "Allow anon all operations on news_posts" ON public.news_posts;

-- Re-create clean policies
CREATE POLICY "Allow public read access to published news" 
ON public.news_posts FOR SELECT 
USING (status IS NULL OR LOWER(status) = 'published');

CREATE POLICY "Allow authenticated full access to news_posts" 
ON public.news_posts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anon full access to news_posts" 
ON public.news_posts FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

