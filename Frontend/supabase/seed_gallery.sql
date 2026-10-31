-- Run only once: Seeds gallery table with authentic ClinGene static data
-- Total records: 12

CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_alt TEXT,
    caption TEXT,
    category TEXT,
    event_date DATE,
    status TEXT NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Allow public read access to published gallery') THEN
        CREATE POLICY "Allow public read access to published gallery" ON public.gallery FOR SELECT USING (status IS NULL OR LOWER(status) = 'published');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Allow authenticated users full access to gallery') THEN
        CREATE POLICY "Allow authenticated users full access to gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

INSERT INTO public.gallery (
    title,
    image_url,
    image_alt,
    caption,
    category,
    event_date,
    status,
    sort_order
) VALUES
(
    'High-Throughput Next-Generation Sequencing Core',
    '/assets/home/gallery1.jpeg',
    'High-Throughput Next-Generation Sequencing Core',
    'State-of-the-art sequencing instrumentation providing high-coverage clinical whole exome and targeted panel assays.',
    'ClinGene Genomics Lab',
    '2026-01-01',
    'published',
    1
),
(
    'DNA Analysis & Bioinformatic Interpretation Workstation',
    '/assets/home/gallery2.jpeg',
    'DNA Analysis & Bioinformatic Interpretation Workstation',
    'Clinical geneticists reviewing high-depth variant call files (VCFs) and pedigree linkage mappings.',
    'Scientific Symposiums',
    '2026-01-01',
    'published',
    2
),
(
    'High-Resolution Fluorescence & Optical Microscopy Bench',
    '/assets/micro.jpg',
    'High-Resolution Fluorescence & Optical Microscopy Bench',
    'Cellular cytogenetics and chromosomal karyotyping validation bench at ClinGene Islamabad.',
    'Research Bench & Compute',
    '2025-01-01',
    'published',
    3
),
(
    'Precision Life Sciences & Genomic Medicine Laboratory',
    '/assets/service-hero.webp',
    'Precision Life Sciences & Genomic Medicine Laboratory',
    'Automated sample preparation, acoustic shearing, and library quantitation equipment.',
    'ClinGene Genomics Lab',
    '2026-01-01',
    'published',
    4
),
(
    'Molecular Reagent Prep & Sample Inoculation',
    '/assets/about us/about-injection.jpeg',
    'Molecular Reagent Prep & Sample Inoculation',
    'Strict cleanroom PCR workstations preventing amplicon contamination during diagnostic library amplification.',
    'ClinGene Genomics Lab',
    '2025-01-01',
    'published',
    5
),
(
    'Genetic Counseling & Family Risk Evaluation Suite',
    '/assets/about us/aim-pic.jpeg',
    'Genetic Counseling & Family Risk Evaluation Suite',
    'Private consultation room where families receive compassionate, certified pre- and post-test genetic counseling.',
    'Diagnostic Facilities',
    '2026-01-01',
    'published',
    6
),
(
    'Scientific Leadership & Laboratory Research Community',
    '/assets/about us/character.png',
    'Scientific Leadership & Laboratory Research Community',
    'ClinGene scientists, bioinformaticians, and medical physicists collaborating on precision health initiatives.',
    'Diagnostic Facilities',
    '2026-01-01',
    'published',
    7
),
(
    'Automated Nucleic Acid Fluorometry & Bioanalyzer QC',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
    'Automated Nucleic Acid Fluorometry & Bioanalyzer QC',
    'Automated microfluidic chip capillary electrophoresis validating DNA fragment size distributions prior to sequencing.',
    'ClinGene Genomics Lab',
    '2026-01-01',
    'published',
    8
),
(
    'National Genomic Medicine Symposium & Clinical Review',
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200&auto=format&fit=crop&q=80',
    'National Genomic Medicine Symposium & Clinical Review',
    'Annual genomic conference convening oncologists, pediatricians, and researchers discussing precision care.',
    'Scientific Symposiums',
    '2026-01-01',
    'published',
    9
),
(
    'High-Performance Cluster for Multi-Omics Pipeline Execution',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80',
    'High-Performance Cluster for Multi-Omics Pipeline Execution',
    'Dedicated GPU and multi-core server racks executing de novo pangenome graphs and molecular dynamics simulations.',
    'Research Bench & Compute',
    '2025-01-01',
    'published',
    10
),
(
    'Sterile Biosafety Cabinet for Clinical Pathology Handling',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
    'Sterile Biosafety Cabinet for Clinical Pathology Handling',
    'Certified Class II Type A2 biosafety cabinet ensuring operator and sample protection for infectious specimens.',
    'Diagnostic Facilities',
    '2026-01-01',
    'published',
    11
),
(
    'Postgraduate Hands-on Molecular Diagnostics Workshop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    'Postgraduate Hands-on Molecular Diagnostics Workshop',
    'Young researchers receiving direct mentoring on Sanger sequencing traces and electropherogram base calling.',
    'Scientific Symposiums',
    '2025-01-01',
    'published',
    12
);
