import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export function useLikedTracks(userId?: string) {
    const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLikedTrackIds([]);
            setLoading(false);
            return;
        }

        async function fetchLikedTracks() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('track_likes')
                    .select('track_id')
                    .eq('user_id', userId);

                if (error) throw error;

                setLikedTrackIds(data.map((item: any) => item.track_id));
            } catch (error) {
                console.error('Error fetching liked tracks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLikedTracks();
    }, [userId]);

    return { likedTrackIds, setLikedTrackIds, loading };
}
