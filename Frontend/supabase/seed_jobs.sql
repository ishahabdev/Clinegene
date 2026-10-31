-- Run only once: Seeds jobs table with authentic ClinGene static data
-- Total records: 13

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT,
    department TEXT,
    job_type TEXT,
    job_status TEXT,
    applicants_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Allow public read access to published jobs') THEN
        CREATE POLICY "Allow public read access to published jobs" ON public.jobs FOR SELECT USING (status = 'published');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Allow authenticated users full access to jobs') THEN
        CREATE POLICY "Allow authenticated users full access to jobs" ON public.jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

INSERT INTO public.jobs (
    title,
    short_description,
    department,
    job_type,
    job_status,
    applicants_count,
    status,
    sort_order
) VALUES
(
    'Bioinformatician',
    NULL,
    'Bioinformatics',
    NULL,
    NULL,
    0,
    'published',
    1
),
(
    'Data Scientist',
    NULL,
    'Bioinformatics',
    NULL,
    NULL,
    0,
    'published',
    2
),
(
    'Pipeline Developer',
    NULL,
    'Bioinformatics',
    NULL,
    NULL,
    0,
    'published',
    3
),
(
    'Genetic Counselor',
    NULL,
    'Human Genetics',
    NULL,
    NULL,
    0,
    'published',
    4
),
(
    'Clinical Research Associate',
    NULL,
    'Human Genetics',
    NULL,
    NULL,
    0,
    'published',
    5
),
(
    'Lab Technician',
    NULL,
    'Laboratory Sciences',
    NULL,
    NULL,
    0,
    'published',
    6
),
(
    'Research Associate',
    NULL,
    'Laboratory Sciences',
    NULL,
    NULL,
    0,
    'published',
    7
),
(
    'Computational Biologist',
    NULL,
    'Computational Biology',
    NULL,
    NULL,
    0,
    'published',
    8
),
(
    'Machine Learning Engineer',
    NULL,
    'Computational Biology',
    NULL,
    NULL,
    0,
    'published',
    9
),
(
    'Training Coordinator',
    NULL,
    'Training & Outreach',
    NULL,
    NULL,
    0,
    'published',
    10
),
(
    'Outreach Specialist',
    NULL,
    'Training & Outreach',
    NULL,
    NULL,
    0,
    'published',
    11
),
(
    'Research Associate (R&D)',
    NULL,
    'Research & Development',
    NULL,
    NULL,
    0,
    'published',
    12
),
(
    'Postdoctoral Fellow',
    NULL,
    'Research & Development',
    NULL,
    NULL,
    0,
    'published',
    13
);
