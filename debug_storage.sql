-- Drop existing policies to avoid conflicts
drop policy if exists "Authenticated Upload Tracks" on storage.objects;
drop policy if exists "Authenticated Upload Images" on storage.objects;
drop policy if exists "Public Access Tracks" on storage.objects;
drop policy if exists "Public Access Images" on storage.objects;

-- Create very permissive policies for debugging
create policy "Debug Public Select Tracks" on storage.objects for select using ( bucket_id = 'tracks' );
create policy "Debug Public Insert Tracks" on storage.objects for insert with check ( bucket_id = 'tracks' );
create policy "Debug Public Update Tracks" on storage.objects for update using ( bucket_id = 'tracks' );
create policy "Debug Public Delete Tracks" on storage.objects for delete using ( bucket_id = 'tracks' );

create policy "Debug Public Select Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Debug Public Insert Images" on storage.objects for insert with check ( bucket_id = 'images' );
