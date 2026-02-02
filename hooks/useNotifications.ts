import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Notification {
    id: string;
    type: 'like_track' | 'new_follower' | 'new_track';
    created_at: string;
    is_read: boolean;
    actor: {
        username: string;
        avatar_url: string;
    };
    entity_id: string | null;
}

export function useNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select(`
            *,
            actor:actor_id (
              username,
              avatar_url
            )
          `)
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setNotifications(data || []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        // Realtime subscription
        const subscription = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    // Re-fetch to get the full data with joined actor details
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [userId]);

    return { notifications, loading };
}
