-- Create notifications table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('like_track', 'new_follower', 'new_track')),
  entity_id uuid, -- Can be track_id or null for follows
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Triggers

-- 1. On Track Like
create or replace function public.handle_new_track_like()
returns trigger as $$
begin
  -- Don't notify if user likes their own track
  if new.user_id != (select artist_id from public.tracks where id = new.track_id) then
    insert into public.notifications (user_id, actor_id, type, entity_id)
    values (
      (select artist_id from public.tracks where id = new.track_id), -- Recipient (Track Artist)
      new.user_id, -- Actor (Liker)
      'like_track',
      new.track_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_track_like on public.track_likes;
create trigger on_track_like
  after insert on public.track_likes
  for each row execute procedure public.handle_new_track_like();

-- 2. On Follow
create or replace function public.handle_new_follow()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type, entity_id)
  values (
    new.following_id, -- Recipient (Person being followed)
    new.follower_id, -- Actor (Follower)
    'new_follower',
    null
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_follow on public.follows;
create trigger on_follow
  after insert on public.follows
  for each row execute procedure public.handle_new_follow();

-- 3. On New Track (Notify followers)
create or replace function public.handle_new_track_upload()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type, entity_id)
  select
    follower_id, -- Recipient (Follower)
    new.artist_id, -- Actor (Artist)
    'new_track',
    new.id
  from public.follows
  where following_id = new.artist_id;
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_new_track_upload on public.tracks;
create trigger on_new_track_upload
  after insert on public.tracks
  for each row execute procedure public.handle_new_track_upload();
