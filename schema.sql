-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (public profile info)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  banner_url text,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Tracks table
create table tracks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  artist_id uuid references profiles(id) not null,
  album text,
  duration text, -- Storing as text for simplicity like "3:42"
  plays bigint default 0,
  likes bigint default 0,
  media_url text not null, -- URL to the audio file
  image_url text, -- Cover art
  bpm text,
  note text,
  type text, -- 'music', 'beat', 'sample'
  genre text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for tracks
alter table tracks enable row level security;
create policy "Tracks are viewable by everyone." on tracks for select using (true);
create policy "Authenticated users can insert tracks." on tracks for insert with check (auth.role() = 'authenticated');
create policy "Users can update own tracks." on tracks for update using (auth.uid() = artist_id);

-- Playlists table
create table playlists (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  user_id uuid references profiles(id) not null,
  genre text,
  type text, -- 'music', 'beat'
  banner_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for playlists
alter table playlists enable row level security;
create policy "Playlists are viewable by everyone." on playlists for select using (true);
create policy "Authenticated users can insert playlists." on playlists for insert with check (auth.role() = 'authenticated');
create policy "Users can update own playlists." on playlists for update using (auth.uid() = user_id);

-- Playlist Tracks (Junction table)
create table playlist_tracks (
  playlist_id uuid references playlists(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (playlist_id, track_id)
);

-- RLS for playlist_tracks
alter table playlist_tracks enable row level security;
create policy "Playlist tracks are viewable by everyone." on playlist_tracks for select using (true);
create policy "Playlist owners can insert tracks." on playlist_tracks for insert with check (
  exists ( select 1 from playlists where id = playlist_id and user_id = auth.uid() )
);

-- Posts table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  type text not null, -- 'photo', 'video'
  media_url text,
  caption text,
  likes bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for posts
alter table posts enable row level security;
create policy "Posts are viewable by everyone." on posts for select using (true);
create policy "Authenticated users can insert posts." on posts for insert with check (auth.role() = 'authenticated');
create policy "Users can update own posts." on posts for update using (auth.uid() = user_id);

-- Likes table (for tracks)
create table track_likes (
  user_id uuid references profiles(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, track_id)
);

-- RLS for track_likes
alter table track_likes enable row level security;
create policy "Likes are viewable by everyone." on track_likes for select using (true);
create policy "Authenticated users can insert likes." on track_likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes." on track_likes for delete using (auth.uid() = user_id);

-- Follows table
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- RLS for follows
alter table follows enable row level security;
create policy "Follows are viewable by everyone." on follows for select using (true);
create policy "Authenticated users can follow." on follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow." on follows for delete using (auth.uid() = follower_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Buckets
insert into storage.buckets (id, name, public) values ('tracks', 'tracks', true);
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id in ('tracks', 'images') );
create policy "Authenticated users can upload" on storage.objects for insert with check ( auth.role() = 'authenticated' );
create policy "Users can update own objects" on storage.objects for update using ( auth.uid() = owner );
create policy "Users can delete own objects" on storage.objects for delete using ( auth.uid() = owner );

-- Comments table
create table comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for comments
alter table comments enable row level security;
create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Authenticated users can insert comments." on comments for insert with check (auth.role() = 'authenticated');
create policy "Users can delete own comments." on comments for delete using (auth.uid() = user_id);
