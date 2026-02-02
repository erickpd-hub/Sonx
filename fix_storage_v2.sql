
-- Create buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('tracks', 'tracks', true)
on conflict (id) do update set public = true;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access Images" on storage.objects;
drop policy if exists "Authenticated Upload Images" on storage.objects;
drop policy if exists "Owner Update Images" on storage.objects;
drop policy if exists "Owner Delete Images" on storage.objects;

-- Create permissive policies for images
create policy "Public Access Images"
on storage.objects for select
using ( bucket_id = 'images' );

create policy "Authenticated Upload Images"
on storage.objects for insert
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Owner Update Images"
on storage.objects for update
using ( bucket_id = 'images' and auth.uid() = owner );

create policy "Owner Delete Images"
on storage.objects for delete
using ( bucket_id = 'images' and auth.uid() = owner );
