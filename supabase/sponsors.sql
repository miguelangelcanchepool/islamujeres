-- Patrocinadores del carrusel.
-- Ejecutar en el editor SQL de Supabase después de supabase/schema.sql.
-- Se puede volver a ejecutar: no borra filas ni toca lugares.
-- No modifica public.places, place_photos, place_links, place_admins,
-- sus políticas RLS, ni el bucket place-photos.
-- Crea public.sponsors, la lectura pública de activos, la gestión de
-- administradores y el bucket sponsor-logos.
-- Reutiliza public.is_place_admin() y public.set_updated_at().

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sponsors_name_present check (char_length(btrim(name)) between 1 and 80),
  constraint sponsors_logo_url_length check (
    logo_url is null or char_length(logo_url) between 1 and 2000
  ),
  constraint sponsors_sort_order_nonnegative check (sort_order >= 0)
);

alter table public.sponsors
  add column if not exists website_url text;

alter table public.sponsors drop constraint if exists sponsors_website_url_length;
alter table public.sponsors add constraint sponsors_website_url_length
  check (
    website_url is null
    or char_length(website_url) between 1 and 2000
  );

create index if not exists sponsors_sort_order_idx
  on public.sponsors (sort_order, id);

drop trigger if exists sponsors_set_updated_at on public.sponsors;
create trigger sponsors_set_updated_at
  before update on public.sponsors
  for each row execute function public.set_updated_at();

alter table public.sponsors enable row level security;

-- El público (anon y sesiones que no administran) solo lee activos.
-- La política de administrador se suma: un admin también ve inactivos.
drop policy if exists "sponsors_public_read" on public.sponsors;
create policy "sponsors_public_read"
  on public.sponsors
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "sponsors_admin_write" on public.sponsors;
create policy "sponsors_admin_write"
  on public.sponsors
  for all
  to authenticated
  using (public.is_place_admin())
  with check (public.is_place_admin());

grant select on public.sponsors to anon;
grant select, insert, update, delete on public.sponsors to authenticated;
revoke insert, update, delete on public.sponsors from anon;

-- Bucket aparte de las fotografías de lugares.
-- Público en lectura por URL. Escritura solo para administradores.
-- 5 MB. JPG, PNG y WebP. No hace falta crearlo en el panel de Storage
-- si este script termina sin error.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sponsor-logos',
  'sponsor-logos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sponsor_logos_storage_read" on storage.objects;
create policy "sponsor_logos_storage_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'sponsor-logos');

drop policy if exists "sponsor_logos_storage_insert" on storage.objects;
create policy "sponsor_logos_storage_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'sponsor-logos'
    and public.is_place_admin()
  );

drop policy if exists "sponsor_logos_storage_delete" on storage.objects;
create policy "sponsor_logos_storage_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'sponsor-logos'
    and public.is_place_admin()
  );
