-- Borrador para una fase posterior. No está aplicado.
-- La guía pública lee hoy el catálogo local de lib/places/catalog.ts.
-- No coloques la clave service_role en el navegador ni en variables NEXT_PUBLIC_.

create type public.place_category as enum (
  'playas',
  'cultura',
  'gastronomia',
  'hoteles',
  'tours',
  'aliados'
);

create type public.visibility_level as enum (
  'informativo',
  'aliado',
  'destacado'
);

create type public.publication_status as enum (
  'borrador',
  'publicado',
  'inactivo'
);

create table public.places (
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

create table public.place_photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  src text not null,
  alt text not null,
  author text,
  sort_order integer not null default 0
);

create table public.place_links (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null default 0
);

-- Administradores del panel futuro. Vacía hasta que exista autenticación.
create table public.place_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.places enable row level security;
alter table public.place_photos enable row level security;
alter table public.place_links enable row level security;
alter table public.place_admins enable row level security;

-- Lectura pública: solo fichas publicadas y sus fotos y enlaces.
create policy "places_public_read"
  on public.places
  for select
  to anon, authenticated
  using (status = 'publicado');

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

-- Escritura solo para usuarios presentes en place_admins.
-- No hay política para anon. No uses la clave service_role en el cliente.
create policy "places_admin_write"
  on public.places
  for all
  to authenticated
  using (exists (select 1 from public.place_admins where user_id = auth.uid()))
  with check (exists (select 1 from public.place_admins where user_id = auth.uid()));

create policy "place_photos_admin_write"
  on public.place_photos
  for all
  to authenticated
  using (exists (select 1 from public.place_admins where user_id = auth.uid()))
  with check (exists (select 1 from public.place_admins where user_id = auth.uid()));

create policy "place_links_admin_write"
  on public.place_links
  for all
  to authenticated
  using (exists (select 1 from public.place_admins where user_id = auth.uid()))
  with check (exists (select 1 from public.place_admins where user_id = auth.uid()));
