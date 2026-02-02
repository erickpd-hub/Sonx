
create or replace function decrement_likes(row_id uuid)
returns void
language plpgsql
as $$
begin
  update tracks
  set likes = greatest(0, likes - 1)
  where id = row_id;
end;
$$;
