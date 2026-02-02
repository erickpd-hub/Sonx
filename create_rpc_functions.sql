-- Function to increment likes
create or replace function increment_likes(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.tracks
  set likes = likes + 1
  where id = row_id;
end;
$$;

-- Function to decrement likes
create or replace function decrement_likes(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.tracks
  set likes = likes - 1
  where id = row_id;
end;
$$;
