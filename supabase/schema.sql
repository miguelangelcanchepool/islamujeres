-- Etapa 1. Ejecutar en el editor SQL de Supabase, antes de supabase/seed.sql.
-- Se puede volver a ejecutar: no borra lugares ni desactiva RLS.
-- La aplicación lee con SUPABASE_URL y SUPABASE_ANON_KEY solo en el servidor.
-- No declares la clave anónima ni la service_role como NEXT_PUBLIC_.
-- La service_role no la usa el sitio. El primer administrador se inserta en una etapa posterior.
-- gen_random_uuid() forma parte de Postgres 13 o posterior, que es lo que usa Supabase.

do $$
begin
  create type public.place_category as enum (
    'playas',
    'cultura',
    'gastronomia',
    'hoteles',
    'tours',
    'aliados'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.visibility_level as enum (
    'informativo',
    'aliado',
    'destacado'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.publication_status as enum (
    'borrador',
    'publicado',
    'inactivo'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.place_category not null,
  visibility public.visibility_level not null default 'informativo',
  status public.publication_status not null default 'borrador',
  origin text not null default 'editorial',
  summary text not null,
  description text,
  address text,
  latitude double precision,
  longitude double precision,
  location_note text,
  phone text,
  whatsapp text,
  website text,
  hours text,
  directions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint places_coordinates_pair check (
    (latitude is null and longitude is null)
    or (latitude is not null and longitude is not null)
  )
);

alter table public.places drop constraint if exists places_origin_known;
alter table public.places add constraint places_origin_known
  check (origin in ('editorial', 'openstreetmap', 'demostracion'));

create table if not exists public.place_photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  src text not null,
  alt text not null,
  author text,
  license text,
  license_url text,
  source_url text,
  sort_order integer not null default 0
);

alter table public.place_photos add column if not exists license text;
alter table public.place_photos add column if not exists license_url text;
alter table public.place_photos add column if not exists source_url text;

create unique index if not exists place_photos_place_src_key
  on public.place_photos (place_id, src);

create table if not exists public.place_links (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  label text not null,
  href text not null,
  kind text not null default 'social',
  sort_order integer not null default 0
);

alter table public.place_links add column if not exists kind text;
update public.place_links set kind = 'social' where kind is null;
alter table public.place_links alter column kind set default 'social';
alter table public.place_links alter column kind set not null;

alter table public.place_links drop constraint if exists place_links_kind_known;
alter table public.place_links add constraint place_links_kind_known
  check (kind in ('social', 'website', 'whatsapp'));

create unique index if not exists place_links_place_href_key
  on public.place_links (place_id, kind, href);

-- Vacía hasta la etapa de autenticación. No hay alta pública.
create table if not exists public.place_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create index if not exists places_status_idx on public.places (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

-- security definer: place_admins tiene RLS y, sin esto, la política de
-- escritura no vería ninguna fila aunque el usuario fuera administrador.
create or replace function public.is_place_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.place_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.is_place_admin() from public, anon;
grant execute on function public.is_place_admin() to authenticated;

alter table public.places enable row level security;
alter table public.place_photos enable row level security;
alter table public.place_links enable row level security;
alter table public.place_admins enable row level security;

drop policy if exists "places_public_read" on public.places;
create policy "places_public_read"
  on public.places
  for select
  to anon, authenticated
  using (status = 'publicado');

drop policy if exists "place_photos_public_read" on public.place_photos;
create policy "place_photos_public_read"
  on public.place_photos
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.places
      where places.id = place_photos.place_id
        and places.status = 'publicado'
    )
  );

drop policy if exists "place_links_public_read" on public.place_links;
create policy "place_links_public_read"
  on public.place_links
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.places
      where places.id = place_links.place_id
        and places.status = 'publicado'
    )
  );

drop policy if exists "place_admins_read_self" on public.place_admins;
create policy "place_admins_read_self"
  on public.place_admins
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "places_admin_write" on public.places;
create policy "places_admin_write"
  on public.places
  for all
  to authenticated
  using (public.is_place_admin())
  with check (public.is_place_admin());

drop policy if exists "place_photos_admin_write" on public.place_photos;
create policy "place_photos_admin_write"
  on public.place_photos
  for all
  to authenticated
  using (public.is_place_admin())
  with check (public.is_place_admin());

drop policy if exists "place_links_admin_write" on public.place_links;
create policy "place_links_admin_write"
  on public.place_links
  for all
  to authenticated
  using (public.is_place_admin())
  with check (public.is_place_admin());

grant select on public.places, public.place_photos, public.place_links to anon;
grant select, insert, update, delete on public.places, public.place_photos, public.place_links to authenticated;
grant select on public.place_admins to authenticated;
revoke insert, update, delete on public.place_admins from anon, authenticated;
