-- Remove debug policies
drop policy if exists "Debug Public Select Tracks" on storage.objects;
drop policy if exists "Debug Public Insert Tracks" on storage.objects;
drop policy if exists "Debug Public Update Tracks" on storage.objects;
drop policy if exists "Debug Public Delete Tracks" on storage.objects;

drop policy if exists "Debug Public Select Images" on storage.objects;
drop policy if exists "Debug Public Insert Images" on storage.objects;

-- Remove potentially conflicting existing policies
drop policy if exists "Public Access Tracks" on storage.objects;
drop policy if exists "Public Access Images" on storage.objects;
drop policy if exists "Authenticated Upload Tracks" on storage.objects;
drop policy if exists "Authenticated Upload Images" on storage.objects;
drop policy if exists "Owner Update Tracks" on storage.objects;
drop policy if exists "Owner Delete Tracks" on storage.objects;
drop policy if exists "Owner Update Images" on storage.objects;
drop policy if exists "Owner Delete Images" on storage.objects;

-- Re-apply secure policies
-- Public access for reading
create policy "Public Access Tracks" on storage.objects for select using ( bucket_id = 'tracks' );
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );

-- Authenticated access for uploading
create policy "Authenticated Upload Tracks" on storage.objects for insert with check ( bucket_id = 'tracks' and auth.role() = 'authenticated' );
create policy "Authenticated Upload Images" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Owner access for update/delete
create policy "Owner Update Tracks" on storage.objects for update using ( bucket_id = 'tracks' and auth.uid() = owner );
create policy "Owner Delete Tracks" on storage.objects for delete using ( bucket_id = 'tracks' and auth.uid() = owner );

create policy "Owner Update Images" on storage.objects for update using ( bucket_id = 'images' and auth.uid() = owner );
create policy "Owner Delete Images" on storage.objects for delete using ( bucket_id = 'images' and auth.uid() = owner );
