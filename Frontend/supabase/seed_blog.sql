-- ClinGene Blog Posts Table & RLS Policies (No static mock data)

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

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow public read access to published blogs') THEN
        CREATE POLICY "Allow public read access to published blogs" ON public.blog_posts FOR SELECT USING (status IS NULL OR LOWER(status) = 'published');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow authenticated users full access to blog_posts') THEN
        CREATE POLICY "Allow authenticated users full access to blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow anon all operations on blog_posts') THEN
        CREATE POLICY "Allow anon all operations on blog_posts" ON public.blog_posts FOR ALL TO anon USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Purge demo static data if present
DELETE FROM public.blog_posts WHERE slug IN (
    'clinical-exome-launch-islamabad',
    'world-dna-day-symposium',
    'cardiomyopathy-variants-study',
    'pakgen-af-population-atlas',
    'crop-pangenomics-platform',
    'ngs-bioinformatics-workshop'
);
