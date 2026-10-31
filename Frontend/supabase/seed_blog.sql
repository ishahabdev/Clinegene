-- Run only once: Seeds blog_posts table with authentic ClinGene static data
-- Total records: 6

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
        CREATE POLICY "Allow public read access to published blogs" ON public.blog_posts FOR SELECT USING (status = 'published');
    END IF;
END $$;

INSERT INTO public.blog_posts (
    title,
    slug,
    category,
    excerpt,
    content,
    image_url,
    image_alt,
    publish_date,
    author,
    tags,
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
    'Dr. Amjad Ali Tanoli Ph.D',
    'Clinical Exome, Genomics, Islamabad, ACMG',
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
    'Dr. Safdar Ali, Ph.D, Postdoc',
    'DNA Day, Symposium, Precision Medicine, Healthcare',
    'published'
),
(
    'Novel Pathogenic Variants Identified in Hereditary Cardiomyopathies',
    'novel-cardiomyopathy-variants',
    'Research',
    'A clinical study spearheaded by ClinGene''s Human Genetics Department has characterized novel frameshift mutations in the MYH7 and TNNT2 genes responsible for familial hypertrophic cardiomyopathy in three independent lineages.',
    'Sudden unexpected death in young individuals often stems from inherited cardiac channelopathies or cardiomyopathies that remain undiagnosed until post-mortem examination.

Using our high-depth 174-gene Cardiac Panel, our research group screened 48 families presenting with unexplained syncope or early sudden cardiac arrest.

The identification of novel truncated alleles allows immediate cascade testing for at-risk first-degree relatives, enabling life-saving prophylactic implantable cardioverter-defibrillator (ICD) placements and lifestyle modifications.',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&auto=format&fit=crop&q=80',
    'Novel Pathogenic Variants Identified in Hereditary Cardiomyopathies',
    '2026-02-14',
    'Dr. Kifayat Ullah, Ph.D',
    'Cardiomyopathy, Targeted Panel, Cardiac Genetics, Research',
    'published'
),
(
    'Building the Pakistani Population Allele Frequency Atlas (PakGen-AF)',
    'pakistani-allele-frequency-database',
    'Clinical Genetics',
    'ClinGene’s computational biology wing has published the inaugural release of the PakGen-AF repository, cataloging over 4.2 million localized single nucleotide polymorphisms from healthy Pakistani donors.',
    'Clinical laboratories worldwide routinely query databases like gnomAD, 1000 Genomes, and ClinVar to evaluate whether an observed variant is rare enough to be considered disease-causing.

However, South Asian cohorts—and particularly Pakistani consanguineous populations—have historically been underrepresented, causing benign regional variants to be incorrectly classified as ''Variants of Uncertain Significance'' (VUS) or false positives.

With PakGen-AF, our automated variant annotation pipeline filters out harmless ethnic polymorphisms, boosting definitive diagnostic confidence for clinicians and patients.',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&auto=format&fit=crop&q=80',
    'Building the Pakistani Population Allele Frequency Atlas (PakGen-AF)',
    '2025-12-18',
    'Mudassir Alvi Ph.D',
    'Population Health, Bioinformatics, Allele Frequency, PakGen',
    'published'
),
(
    'Comprehensive Horticultural & Crop Pangenomics Platform Unveiled',
    'crop-genomics-pangenome-release',
    'Research',
    'ClinGene’s Laboratory Sciences Division has launched an integrated plant genomics pipeline combining Oxford Nanopore ultra-long reads with high-throughput Illumina short reads to resolve complex polyploid plant genomes.',
    'Climatic stress and emergent fungal blights pose serious challenges to Pakistan''s agricultural sustainability and horticultural export potential.

Dr. Abid Ali and Dr. Samrana demonstrated how de novo graph pangenomes capture the presence-absence variations (PAVs) that conventional reference genomes miss completely.

This service enables seed breeders, research institutes, and agricultural universities to map quantitative trait loci (QTLs) for drought resistance, salinity tolerance, and enhanced nutrient uptake.',
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&auto=format&fit=crop&q=80',
    'Comprehensive Horticultural & Crop Pangenomics Platform Unveiled',
    '2025-09-12',
    'Dr. Abid Ali, Ph.D, Postdoc',
    'Agriculture, Pangenomics, Plant Breeding, Bioinformatics',
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
    'Mr. Muhammad Tahir Ullah Ph.D',
    'Training, Workshop, NGS Hands-on, Capacity Building',
    'published'
);
