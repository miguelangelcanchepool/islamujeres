-- Almacén de fotografías de los lugares.
-- No modifica public.place_photos ni las políticas RLS de las tablas.
-- Hay que ejecutarlo una vez en el editor SQL de Supabase.
--
-- El bucket es público solo para lectura por URL, porque la guía muestra
-- las imágenes. No hay permiso de escritura para anon.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'place-photos',
  'place-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "place_photos_storage_read" on storage.objects;
create policy "place_photos_storage_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'place-photos');

drop policy if exists "place_photos_storage_insert" on storage.objects;
create policy "place_photos_storage_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'place-photos'
    and public.is_place_admin()
  );

drop policy if exists "place_photos_storage_delete" on storage.objects;
create policy "place_photos_storage_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'place-photos'
    and public.is_place_admin()
  );
