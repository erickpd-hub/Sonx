
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileView } from "./ProfileView";
import { supabase } from "../utils/supabase/client";
import { useAuth } from "./AuthProvider";
import { useTracks } from "../hooks/useTracks";
import { usePosts } from "../hooks/usePosts";
import { useLikedTracks } from "../hooks/useLikedTracks";

import { useFollow } from "../hooks/useFollow";

export function UserProfilePage({
    isDark,
    onPlayTrack,
    onLikeTrack,
    onDownloadTrack,
    onLikePost,
    onCommentClick,
    onPlayPost
}: any) {
    const { userId } = useParams();
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { tracks } = useTracks();
    const { posts } = usePosts();
    const { likedTrackIds } = useLikedTracks(userId); // Fetch likes for this user

    // Follow hook
    const { isFollowing, toggleFollow, followersCount } = useFollow(userId);

    useEffect(() => {
        async function fetchProfile() {
            if (!userId) return;
            setLoading(true);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                // navigate('/'); // Redirect if not found?
            } else {
                setProfile(data);
            }
            setLoading(false);
        }

        fetchProfile();
    }, [userId]);

    if (loading) return <div className="p-8 text-center">Cargando perfil...</div>;
    if (!profile) return <div className="p-8 text-center">Usuario no encontrado</div>;

    // Filter content for this user
    const userTracks = tracks.filter((t: any) => t.artist_id === userId).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: profile.username || "Unknown",
        artist_id: track.artist_id,
        album: track.album || "Single",
        duration: track.duration || "0:00",
        plays: track.plays,
        likes: track.likes,
        image: track.image_url || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400",
        mediaUrl: track.media_url,
        type: track.type,
        genre: track.genre,
        bpm: track.bpm,
        note: track.note
    }));

    const userPosts = posts.filter((p: any) => p.user_id === userId).map((post: any) => ({
        id: post.id,
        user: {
            userId: post.user_id,
            username: profile.username,
            avatar: profile.avatar_url
        },
        type: post.type,
        mediaUrl: post.media_url,
        caption: post.caption,
        likes: post.likes,
        comments: 0,
        timestamp: new Date(post.created_at).toLocaleDateString(),
    }));

    // For liked tracks, we need to fetch the actual track details.
    // The `likedTrackIds` hook gives us IDs. We can filter `tracks` by these IDs.
    // Note: `useLikedTracks` fetches for the *current* user usually, but we passed `userId` so it should fetch for the profile user if the hook supports it.
    // Let's check `useLikedTracks` implementation.
    // If it doesn't support passing ID, we might need to fetch manually or update the hook.
    // Assuming for now we just show what we have.

    const likedTracksList = tracks.filter((t: any) => likedTrackIds.includes(t.id)).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.profiles?.username || "Unknown",
        artist_id: track.artist_id,
        album: track.album || "Single",
        duration: track.duration || "0:00",
        plays: track.plays,
        likes: track.likes,
        image: track.image_url || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400",
        mediaUrl: track.media_url,
        type: track.type,
        genre: track.genre,
        bpm: track.bpm,
        note: track.note
    }));

    const userObj = {
        username: profile.username || "Usuario",
        avatar: profile.avatar_url || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400",
        banner: profile.banner_url || "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1080",
        isPremium: profile.is_premium || false,
    };

    const isOwner = authUser?.id === userId;

    return (
        <ProfileView
            user={userObj}
            uploadedTracks={userTracks}
            likedTracks={likedTracksList}
            posts={userPosts}
            followers={followersCount || profile.followers_count || 0}
            following={profile.following_count || 0}
            onPlayTrack={onPlayTrack}
            onLikeTrack={onLikeTrack}
            onDownloadTrack={onDownloadTrack}
            onLikePost={onLikePost}
            onCommentClick={onCommentClick}
            onPlayPost={onPlayPost}
            isDark={isDark}
            likedTrackIds={likedTrackIds}
            currentUserId={authUser?.id}
            isOwner={isOwner}
            isFollowing={isFollowing}
            onToggleFollow={toggleFollow}
        />
    );
}
