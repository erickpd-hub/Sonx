import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Post {
    id: string;
    user_id: string;
    type: 'photo' | 'video' | 'text';
    media_url: string | null;
    caption: string | null;
    likes: number;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string | null;
    };
}

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('posts')
                    .select(`
            *,
            profiles (
              username,
              avatar_url
            ),
            comments (count)
          `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setPosts(data || []);
            } catch (err: any) {
                console.error('Error fetching posts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return { posts, loading, error };
}
