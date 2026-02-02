import { useState } from 'react';
import { supabase } from '../utils/supabase/client';

export function useCreatePost() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPost = async (
        userId: string,
        file: File | null,
        caption: string,
        type: 'photo' | 'video' | 'text'
    ) => {
        try {
            setUploading(true);
            setError(null);

            let publicUrl = null;

            // 1. Upload file to storage (only if not text)
            if (type !== 'text' && file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${Date.now()}.${fileExt}`;
                const bucket = 'images'; // Using images bucket for now

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // 2. Get public URL
                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                publicUrl = data.publicUrl;
            }

            // 3. Insert into posts table
            const { data, error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: userId,
                    type,
                    media_url: publicUrl,
                    caption,
                })
                .select()
                .single();

            if (dbError) throw dbError;

            return data;
        } catch (err: any) {
            console.error('Error creating post:', err);
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return { createPost, uploading, error };
}
