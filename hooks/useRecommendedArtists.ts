import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../components/AuthProvider';
import type { Profile } from './useProfile';

export function useRecommendedArtists() {
    const { user } = useAuth();
    const [artists, setArtists] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            setLoading(true);
            try {
                // 1. Get current user profile to know their city and genre
                let currentUserProfile: Profile | null = null;
                if (user) {
                    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    currentUserProfile = data;
                }

                // 2. Get IDs of users already followed
                let followedIds: string[] = [];
                if (user) {
                    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
                    if (data) followedIds = data.map((f: any) => f.following_id);
                }

                // 3. Fetch all profiles (excluding current user)
                let query = supabase.from('profiles').select('*');
                if (user) {
                    query = query.neq('id', user.id);
                }

                const { data: allProfiles, error } = await query;

                if (error) throw error;
                if (!allProfiles) return;

                // 4. Filter out already followed
                let candidates = allProfiles.filter((p: any) => !followedIds.includes(p.id));

                // 5. Score candidates
                const scored = candidates.map((p: any) => {
                    let score = 0;
                    if (currentUserProfile) {
                        if (p.city && currentUserProfile.city && p.city.toLowerCase().trim() === currentUserProfile.city.toLowerCase().trim()) {
                            score += 5; // High score for same city
                        }
                        if (p.genre && currentUserProfile.genre && p.genre === currentUserProfile.genre) {
                            score += 3; // Score for same genre
                        }
                    }
                    // Add random factor to shuffle if no matches
                    score += Math.random();
                    return { ...p, score };
                });

                // 6. Sort by score
                scored.sort((a: any, b: any) => b.score - a.score);

                // 7. Fetch follower counts for top candidates (optimization: only fetch for top 20)
                const topCandidates = scored.slice(0, 20);

                // Fetch follower counts in parallel
                const artistsWithCounts = await Promise.all(topCandidates.map(async (p: any) => {
                    const { count } = await supabase
                        .from('follows')
                        .select('*', { count: 'exact', head: true })
                        .eq('following_id', p.id);

                    // Also fetch track count
                    const { count: trackCount } = await supabase
                        .from('tracks')
                        .select('*', { count: 'exact', head: true })
                        .eq('artist_id', p.id);

                    return {
                        ...p,
                        followers_count: count || 0,
                        tracks_count: trackCount || 0
                    };
                }));

                setArtists(artistsWithCounts);

            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [user]);

    return { artists, loading };
}
