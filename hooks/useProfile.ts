import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Profile {
    id: string;
    username: string;
    avatar_url: string | null;
    banner_url: string | null;
    is_premium: boolean;
    created_at: string;
    followers_count?: number;
    following_count?: number;
    city?: string;
    genre?: string;
}

export function useProfile(userId?: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch profile data
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (profileError) throw profileError;

                // Fetch followers count
                const { count: followersCount, error: followersError } = await supabase
                    .from('follows')
                    .select('*', { count: 'exact', head: true })
                    .eq('following_id', userId);

                if (followersError) console.error('Error fetching followers:', followersError);

                // Fetch following count
                const { count: followingCount, error: followingError } = await supabase
                    .from('follows')
                    .select('*', { count: 'exact', head: true })
                    .eq('follower_id', userId);

                if (followingError) console.error('Error fetching following:', followingError);

                setProfile({
                    ...profileData,
                    followers_count: followersCount || 0,
                    following_count: followingCount || 0,
                });

            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [userId]);

    return { profile, loading, error };
}
