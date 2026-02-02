-- Create comments table
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
create policy "Comments are viewable by everyone." on public.comments for select using (true);
create policy "Authenticated users can insert comments." on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Users can delete own comments." on public.comments for delete using (auth.uid() = user_id);

-- Function to update post comment count (optional but good for performance)
-- For now we will just count them in the query or client-side, but let's keep it simple.
