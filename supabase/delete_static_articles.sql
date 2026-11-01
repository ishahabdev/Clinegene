-- Purge static demo articles from Supabase blog_posts and news_posts tables
-- Slugs matching the initial seed/mock data

DELETE FROM public.blog_posts
WHERE slug IN (
    'clinical-exome-launch-islamabad',
    'world-dna-day-symposium',
    'novel-cardiomyopathy-variants',
    'cardiomyopathy-variants-study',
    'pakistani-allele-frequency-database',
    'pakgen-af-population-atlas',
    'crop-genomics-pangenome-release',
    'crop-pangenomics-platform',
    'hands-on-ngs-workshop',
    'ngs-bioinformatics-workshop'
);

DELETE FROM public.news_posts
WHERE slug IN (
    'clinical-exome-launch-islamabad',
    'world-dna-day-symposium',
    'novel-cardiomyopathy-variants',
    'cardiomyopathy-variants-study',
    'pakistani-allele-frequency-database',
    'pakgen-af-population-atlas',
    'crop-genomics-pangenome-release',
    'crop-pangenomics-platform',
    'hands-on-ngs-workshop',
    'ngs-bioinformatics-workshop'
);

