
-- Add new columns to tracks table
alter table tracks 
add column if not exists description text,
add column if not exists is_public boolean default true,
add column if not exists audience text default 'everyone'; -- 'everyone', 'followers', 'private'
