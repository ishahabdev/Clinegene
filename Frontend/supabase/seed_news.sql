-- Run only once: Seeds news_posts table with authentic ClinGene static data
-- Total records: 3

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

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_posts' AND policyname = 'Allow public read access to published news') THEN
        CREATE POLICY "Allow public read access to published news" ON public.news_posts FOR SELECT USING (status = 'published');
    END IF;
END $$;

INSERT INTO public.news_posts (
    title,
    slug,
    category,
    excerpt,
    content,
    image_url,
    image_alt,
    publish_date,
    source,
    event_date,
    status
) VALUES
(
    'ClinGene Launches Advanced Clinical Exome Sequencing in Islamabad',
    'clinical-exome-launch-islamabad',
    'Announcement',
    'ClinGene has inaugurated its premier high-throughput sequencing suite in Islamabad, bringing state-of-the-art Clinical Whole Exome Sequencing (WES) to patients and clinicians across Pakistan without the delays and risks of overseas sample shipping.',
    'Historically, clinical genomics samples from Pakistan had to be shipped overseas to laboratories in Europe, the United States, or China, resulting in turn-around times exceeding 6 to 8 weeks, prohibitive currency costs, and sample degradation risks during transit.

With ClinGene’s accredited laboratory infrastructure at Park Road, Islamabad, patient samples are prepared, sequenced at 100x mean target coverage, and interpreted by our board-certified human geneticists within 10 to 14 business days.

Each exome report includes rigorous classification according to American College of Medical Genetics and Genomics (ACMG) guidelines, accompanied by one-on-one pre- and post-test genetic counseling to ensure patients and families fully understand their molecular findings.',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80',
    'ClinGene Launches Advanced Clinical Exome Sequencing in Islamabad',
    '2026-10-24',
    'ClinGene Press Office',
    '2026-10-24',
    'published'
),
(
    'Celebrating World DNA Day: Advancing Precision Genomics in Pakistan',
    'world-dna-day-symposium',
    'Events & Outreach',
    'ClinGene commemorated World DNA Day by hosting a national genomic symposium uniting clinicians, geneticists, and university researchers to discuss population genomics, rare diseases, and cancer precision therapeutics.',
    'Dr. Safdar Ali highlighted the clinical revolution occurring at the intersection of medical physics, clinical radiotherapy, and targeted genomic biomarker profiling.

Keynote addresses covered the imperative need for indigenous genetic repositories, emphasizing that South Asian genomic diversity must be properly cataloged to prevent misdiagnoses caused by reliance on Western reference genomes.

Students and research fellows from QAU, NUST, and COMSATS attended hands-on workshops exploring automated variant annotation pipelines and tertiary protein modeling.',
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=900&auto=format&fit=crop&q=80',
    'Celebrating World DNA Day: Advancing Precision Genomics in Pakistan',
    '2026-04-25',
    'ClinGene Communications',
    '2026-04-25',
    'published'
),
(
    'Practical Next-Generation Sequencing & Bioinformatics Training Workshop',
    'hands-on-ngs-workshop',
    'Education',
    'A 3-day intensive wet-lab and computational training course hosted at ClinGene''s Islamabad facility trained 30 molecular biology scholars on DNA extraction, quality control, library fragmentation, and variant calling.',
    'Bridging the gap between theoretical genetics curricula and cutting-edge clinical laboratory practice is a core pillar of ClinGene’s educational mission.

Participants engaged directly with fluorometric quantitation (Qubit), automated fragment analysis, and Linux-based bioinformatic pipelines executing BWA-MEM alignment and GATK variant calling.

ClinGene plans to run bi-annual certified training cohorts to nurture local scientific talent and establish Pakistan as a regional hub for genomics excellence.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
    'Practical Next-Generation Sequencing & Bioinformatics Training Workshop',
    '2025-07-08',
    'ClinGene Training Wing',
    '2025-07-08',
    'published'
);
