-- Enlace opcional de cada patrocinador.
-- Ejecutar en el editor SQL de Supabase después de supabase/sponsors.sql.
-- Se puede volver a ejecutar. No borra filas, no cambia logotipos
-- y no modifica las políticas RLS ni el bucket sponsor-logos.

alter table public.sponsors
  add column if not exists website_url text;

alter table public.sponsors drop constraint if exists sponsors_website_url_length;
alter table public.sponsors add constraint sponsors_website_url_length
  check (
    website_url is null
    or char_length(website_url) between 1 and 2000
  );
