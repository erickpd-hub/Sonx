-- Ensure buckets exist
insert into storage.buckets (id, name, public) values ('tracks', 'tracks', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

-- Drop generic policies if they exist (this might fail if names don't match, so we'll just add specific ones)
-- It's better to just add permissive policies for now to get it working

create policy "Public Access Tracks" on storage.objects for select using ( bucket_id = 'tracks' );
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );

create policy "Authenticated Upload Tracks" on storage.objects for insert with check ( bucket_id = 'tracks' and auth.role() = 'authenticated' );
create policy "Authenticated Upload Images" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Owner Update Tracks" on storage.objects for update using ( bucket_id = 'tracks' and auth.uid() = owner );
create policy "Owner Delete Tracks" on storage.objects for delete using ( bucket_id = 'tracks' and auth.uid() = owner );

create policy "Owner Update Images" on storage.objects for update using ( bucket_id = 'images' and auth.uid() = owner );
create policy "Owner Delete Images" on storage.objects for delete using ( bucket_id = 'images' and auth.uid() = owner );
