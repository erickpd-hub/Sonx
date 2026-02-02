import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Track {
    id: string;
    title: string;
    artist_id: string;
    album: string | null;
    duration: string | null;
    plays: number;
    likes: number;
    media_url: string;
    image_url: string | null;
    bpm: string | null;
    note: string | null;
    type: string | null;
    genre: string | null;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string | null;
    };
}

export function useTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTracks();
    }, []);

    async function fetchTracks() {
        try {
            const { data, error } = await supabase
                .from('tracks')
                .select(`
          *,
          profiles:artist_id (
            username,
            avatar_url
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setTracks(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { tracks, loading, error, refetch: fetchTracks };
}
