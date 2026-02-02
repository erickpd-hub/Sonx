-- Get a user ID (any user) to assign data to
do $$
declare
  v_user_id uuid;
  v_track_id_1 uuid;
  v_track_id_2 uuid;
  v_track_id_3 uuid;
  v_playlist_id uuid;
begin
  select id into v_user_id from auth.users limit 1;
  
  if v_user_id is null then
    raise notice 'No users found. Please sign up at least one user first.';
    return;
  end if;

  -- Insert Tracks
  insert into public.tracks (title, artist_id, album, duration, plays, likes, media_url, image_url, genre, type)
  values 
    ('Flow Supremo', v_user_id, 'Top Hip Hop', '3:42', 15420, 892, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1647220419119-316822d9d053?w=400', 'Hip Hop', 'music')
  returning id into v_track_id_1;

  insert into public.tracks (title, artist_id, album, duration, plays, likes, media_url, image_url, genre, type)
  values 
    ('Noche de Fuego', v_user_id, 'Vibras Urbanas', '4:15', 28450, 1240, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1735827168262-551bde1c928b?w=400', 'Reggaeton', 'music')
  returning id into v_track_id_2;

  insert into public.tracks (title, artist_id, album, duration, plays, likes, media_url, image_url, genre, type)
  values 
    ('Synthetic Dreams', v_user_id, 'Electronic Vibes', '5:23', 32100, 1580, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1712530967389-e4b5b16b8500?w=400', 'Electronic', 'music')
  returning id into v_track_id_3;

  -- Insert Playlists
  insert into public.playlists (title, user_id, genre, type, banner_url)
  values 
    ('Top Hip Hop 2024', v_user_id, 'Hip Hop', 'music', 'https://images.unsplash.com/photo-1647220419119-316822d9d053?w=1080')
  returning id into v_playlist_id;

  -- Add tracks to playlist
  insert into public.playlist_tracks (playlist_id, track_id)
  values 
    (v_playlist_id, v_track_id_1),
    (v_playlist_id, v_track_id_2);

  -- More playlists
  insert into public.playlists (title, user_id, genre, type, banner_url)
  values 
    ('Vibras Urbanas', v_user_id, 'Reggaeton', 'music', 'https://images.unsplash.com/photo-1735827168262-551bde1c928b?w=1080');

  insert into public.playlists (title, user_id, genre, type, banner_url)
  values 
    ('Electronic Vibes', v_user_id, 'Electronic', 'music', 'https://images.unsplash.com/photo-1712530967389-e4b5b16b8500?w=1080');

  -- Insert Posts
  insert into public.posts (user_id, type, media_url, caption, likes)
  values
    (v_user_id, 'photo', 'https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=800', 'Trabajando en mi nuevo álbum 🔥 #HipHop #Studio', 342),
    (v_user_id, 'video', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800', 'Live set de anoche fue increíble! Gracias a todos 💫', 567);

end $$;
