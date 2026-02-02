import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Playlist {
    id: string;
    title: string;
    user_id: string;
    genre: string;
    type: 'music' | 'beat';
    banner_url: string | null;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string | null;
    };
    track_count?: number;
}

export function usePlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('playlists')
                    .select(`
            *,
            profiles (
              username,
              avatar_url
            ),
            playlist_tracks (count)
          `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Transform data to include track_count cleanly
                const formattedPlaylists = data?.map((playlist: any) => ({
                    ...playlist,
                    track_count: playlist.playlist_tracks?.[0]?.count || 0,
                })) || [];

                setPlaylists(formattedPlaylists);
            } catch (err: any) {
                console.error('Error fetching playlists:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPlaylists();
    }, []);

    return { playlists, loading, error };
}
