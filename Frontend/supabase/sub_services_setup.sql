-- Sub-services for the existing services table.
-- Admin authorization uses the existing public.admins(user_id) table.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.sub_services (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  price numeric,
  price_type text not null default 'on_request'
    check (price_type in ('fixed', 'starting_from', 'on_request')),
  duration text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sub_services_name_per_service_unique unique (service_id, name),
  constraint sub_services_slug_per_service_unique unique (service_id, slug),
  constraint sub_services_price_nonnegative check (price is null or price >= 0)
);

create index if not exists sub_services_service_id_idx
  on public.sub_services (service_id);

create index if not exists sub_services_active_order_idx
  on public.sub_services (service_id, is_active, sort_order);

-- Preserve the existing public Genetic Counseling options as manageable rows.
insert into public.sub_services (service_id, name, slug, sort_order)
select
  services.id,
  seed.name,
  seed.slug,
  seed.sort_order
from public.services as services
cross join (
  values
    (1, 'Prenatal Diagnosis', 'prenatal-diagnosis'),
    (2, 'Newborn Screening', 'newborn-screening'),
    (3, 'Genetic Diseases', 'genetic-diseases'),
    (4, 'Chromosomal Abnormalities', 'chromosomal-abnormalities'),
    (5, 'Hereditary Cancer', 'hereditary-cancer')
) as seed(sort_order, name, slug)
where services.slug in ('genetic-counseling', 'genetic-counselling')
   or lower(services.title) in ('genetic counseling', 'genetic counselling')
on conflict do nothing;

create or replace function public.set_sub_services_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_sub_services_updated_at on public.sub_services;
create trigger set_sub_services_updated_at
before update on public.sub_services
for each row
execute function public.set_sub_services_updated_at();

alter table public.sub_services enable row level security;
grant select on public.sub_services to anon, authenticated;
grant insert, update, delete on public.sub_services to authenticated;

drop policy if exists "Public can read active sub-services" on public.sub_services;
create policy "Public can read active sub-services"
on public.sub_services
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all sub-services" on public.sub_services;
create policy "Admins can read all sub-services"
on public.sub_services
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert sub-services" on public.sub_services;
create policy "Admins can insert sub-services"
on public.sub_services
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update sub-services" on public.sub_services;
create policy "Admins can update sub-services"
on public.sub_services
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete sub-services" on public.sub_services;
create policy "Admins can delete sub-services"
on public.sub_services
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'sub-service-images',
  'sub-service-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read sub-service images" on storage.objects;
create policy "Public can read sub-service images"
on storage.objects
for select
to public
using (bucket_id = 'sub-service-images');

drop policy if exists "Admins can upload sub-service images" on storage.objects;
create policy "Admins can upload sub-service images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sub-service-images'
  and public.is_admin()
);

drop policy if exists "Admins can update sub-service images" on storage.objects;
create policy "Admins can update sub-service images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'sub-service-images'
  and public.is_admin()
)
with check (
  bucket_id = 'sub-service-images'
  and public.is_admin()
);

drop policy if exists "Admins can delete sub-service images" on storage.objects;
create policy "Admins can delete sub-service images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sub-service-images'
  and public.is_admin()
);

notify pgrst, 'reload schema';
