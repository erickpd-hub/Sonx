import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string | null;
    };
}

export function useComments(postId: string | null) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            setComments([]);
            return;
        }

        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments(data || []);
        } catch (err: any) {
            console.error('Error fetching comments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (userId: string, content: string) => {
        if (!postId) return;

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    user_id: userId,
                    content,
                })
                .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
                .single();

            if (error) throw error;

            setComments((prev) => [...prev, data]);

            // Update comment count on post (optimistic or trigger based, here we just update local state)
            // In a real app we might want to update the post's comment count in the parent list

            return data;
        } catch (err: any) {
            console.error('Error adding comment:', err);
            throw err;
        }
    };

    return { comments, loading, error, addComment };
}
