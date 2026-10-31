-- =============================================================================
-- ClinGene Team Table & Seed Data
-- Run this script in the Supabase SQL Editor.
-- =============================================================================

-- 1. Create table if not already created
CREATE TABLE IF NOT EXISTS public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    qualification TEXT,
    email TEXT,
    bio TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow public (anon) read access to published members
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'team' AND policyname = 'Allow public read access to published team'
    ) THEN
        CREATE POLICY "Allow public read access to published team" 
        ON public.team 
        FOR SELECT 
        USING (status = 'published');
    END IF;
END $$;

-- Allow authenticated users full CRUD access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'team' AND policyname = 'Allow authenticated users full access'
    ) THEN
        CREATE POLICY "Allow authenticated users full access" 
        ON public.team 
        FOR ALL 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;

-- 4. Seed Data: Existing static team members (status 'published', sort_order in current order)
INSERT INTO public.team (name, role, department, qualification, email, bio, image_url, status, sort_order)
VALUES
(
    'Dr. Amjad Ali Tanoli Ph.D',
    'CEO/Director',
    'Leadership',
    'Human Geneticist, Consultant Genetic Counselor',
    'amjad.tanoli@clingene.pk',
    'Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan''s first human genetics and precision medicine platform. He bridges clinical genetics and genomic technologies.',
    '/assets/team/Amjad Ali.jpeg',
    'published',
    1
),
(
    'Dr. Safdar Ali, Ph.D, Postdoc',
    'Managing Director',
    'Leadership',
    'Princess Margaret Cancer Research Center, Toronto, Canada; Medical Physicist',
    'safdar.tanoli@clingene.pk',
    'Dr. Safdar Ali holds a Ph.D. with postdoctoral experience at the Princess Margaret Cancer Research Center, Toronto, Canada. He is a Medical Physicist and serves as the Managing Director of ClinGene.',
    '/assets/team/Safdar Ali.jpeg',
    'published',
    2
),
(
    'Dr. Abid Ali, Ph.D, Postdoc',
    'Horticulture/Olericulture',
    'Laboratory Sciences',
    'Zhejiang University, China; International Agriculture Research Institute, Yunnan Academy of Agricultural Sciences, China',
    'abid.ali@clingene.pk',
    'Dr. Abid Ali specializes in Horticulture and Olericulture, associated with Zhejiang University, China, and International Agriculture Research Institute, Yunnan Academy of Agricultural Sciences, China.',
    '/assets/team/Abid Ali.jpeg',
    'published',
    3
),
(
    'Dr. Samrana Ph.D',
    'Crop Genetics and Breeding',
    'Laboratory Sciences',
    'Zhejiang University, China.',
    'samrana@clingene.pk',
    'Holds PhD in crop genetics and breeding from Zhejiang University China.',
    '/assets/team/samrana.jpeg',
    'published',
    4
),
(
    'Dr. Kifayat Ullah, Ph.D',
    'Molecular Biologist, Human Geneticist',
    'Human Genetics',
    'Quaid-i-Azam University, Islamabad, Pakistan; Yale School of Medicine, Yale University, USA.',
    'kifayat.ullah@clingene.pk',
    'Dr. Kifayat Ullah leads human genetics research at ClinGene, associated with Quaid-i-Azam University, Islamabad, Pakistan, and Yale School of Medicine, Yale University, USA.',
    '/assets/team/Kifayat ullah.jpeg',
    'published',
    5
),
(
    'Mr. Muhammad Tahir Ullah Ph.D',
    'Molecular Biologist, Human Geneticist',
    'Human Genetics',
    'Quaid-i-Azam University, Islamabad, Pakistan; King’s College London, UK',
    'tahir.ullah@clingene.pk',
    'Mr. Muhammad Tahir Ullah is a Molecular Biologist and Human Geneticist with credentials from Quaid-i-Azam University, Islamabad, Pakistan, and King’s College London, UK.',
    '/assets/team/Tahir Ali.jpeg',
    'published',
    6
),
(
    'Mudassir Alvi Ph.D',
    'Bioinformatician',
    'Bioinformatics',
    'National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.',
    'mudassir.alvi@clingene.pk',
    'Dr. Mudassir Alvi is a Bioinformatician associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.',
    '/assets/team/Mudassir.jpeg',
    'published',
    7
),
(
    'Saad Khan M.Phil',
    'Molecular Biologist, Bioinformatician',
    'Bioinformatics',
    'National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.',
    'saad.khan@clingene.pk',
    'Saad Khan is a Molecular Biologist and Bioinformatician associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.',
    '/assets/team/Saad.jpeg',
    'published',
    8
),
(
    'Imad Ali',
    'Bioinformatician',
    'Bioinformatics',
    'COMSATS University, Islamabad, Pakistan.',
    'imad.ali@clingene.pk',
    'Imad Ali is a Bioinformatician associated with COMSATS University, Islamabad, Pakistan.',
    '/assets/team/Imad Ali.jpeg',
    'published',
    9
);

