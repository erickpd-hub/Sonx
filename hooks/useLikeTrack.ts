import { useState } from 'react';
import { supabase } from '../utils/supabase/client';

export function useLikeTrack() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleLike = async (userId: string, trackId: string, isLiked: boolean) => {
        try {
            setLoading(true);
            setError(null);

            if (isLiked) {
                // Unlike
                const { error } = await supabase
                    .from('track_likes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('track_id', trackId);

                if (error) throw error;

                // Decrement likes count in tracks table (optional, but good for consistency)
                // Note: Real-time updates or triggers are better for this, but simple decrement works for now
                await supabase.rpc('decrement_likes', { row_id: trackId });

            } else {
                // Like
                const { error } = await supabase
                    .from('track_likes')
                    .insert({ user_id: userId, track_id: trackId });

                if (error) throw error;

                // Increment likes count
                await supabase.rpc('increment_likes', { row_id: trackId });
            }

            return !isLiked;
        } catch (err: any) {
            console.error('Error toggling like:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { toggleLike, loading, error };
}
