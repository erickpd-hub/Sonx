import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'sonner';

export function useFollow(targetUserId?: string) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        if (!user || !targetUserId) return;

        const checkFollowStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('follows')
                    .select('*')
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId)
                    .maybeSingle();

                if (error) throw error;
                setIsFollowing(!!data);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        const getFollowersCount = async () => {
            const { count, error } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', targetUserId);

            if (!error && count !== null) {
                setFollowersCount(count);
            }
        }

        checkFollowStatus();
        getFollowersCount();
    }, [user, targetUserId]);

    const toggleFollow = async () => {
        if (!user) {
            toast.error('Debes iniciar sesión para seguir a usuarios');
            return;
        }
        if (!targetUserId) return;

        setLoading(true);
        // Optimistic update
        const previousState = isFollowing;
        const previousCount = followersCount;
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);

        try {
            if (previousState) {
                // Unfollow
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId);

                if (error) throw error;
            } else {
                // Follow
                const { error } = await supabase
                    .from('follows')
                    .insert({
                        follower_id: user.id,
                        following_id: targetUserId
                    });

                if (error) throw error;
            }
        } catch (error: any) {
            console.error('Error toggling follow:', error);
            toast.error('Error al actualizar seguimiento');
            // Revert optimistic update
            setIsFollowing(previousState);
            setFollowersCount(previousCount);
        } finally {
            setLoading(false);
        }
    };

    return { isFollowing, toggleFollow, loading, followersCount };
}
