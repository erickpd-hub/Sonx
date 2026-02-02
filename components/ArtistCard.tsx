import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserPlus, BadgeCheck } from "lucide-react";
import { useFollow } from "../hooks/useFollow";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
    artist: {
        id: string;
        username: string;
        avatar_url: string | null;
        genre?: string;
        followers_count?: number;
        tracks_count?: number;
    };
    isDark: boolean;
}

export function ArtistCard({ artist, isDark }: ArtistCardProps) {
    const navigate = useNavigate();
    const { isFollowing, toggleFollow, followersCount } = useFollow(artist.id);
    // Note: useFollow initializes by checking DB. 
    // Since we filtered out followed users in the recommendation hook, isFollowing should be false initially.
    // But if the user follows and then comes back, it might be true (if we didn't refetch recommendations).
    // Or if the recommendation logic changes.
    // It's safer to let useFollow determine the state.

    const displayFollowers = followersCount !== undefined ? followersCount : (artist.followers_count || 0);

    return (
        <div
            className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} overflow-hidden`}
        >
            <div className={`h-32 relative bg-gradient-to-br from-[var(--color-brutal-blue)] to-[var(--color-brutal-green)] border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => navigate(`/profile/${artist.id}`)}
                        className={`w-20 h-20 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'}`}
                    >
                        <ImageWithFallback
                            src={artist.avatar_url || "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=100"}
                            alt={artist.username}
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </div>

            <div className="pt-12 p-6 text-center">
                <button
                    onClick={() => navigate(`/profile/${artist.id}`)}
                    className={`font-black ${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors text-xl mb-2`}
                >
                    {artist.username}
                </button>
                <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 mb-1`}>
                    {artist.genre || "Artista"}
                </p>
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div>
                        <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>{displayFollowers}</p>
                        <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 text-sm`}>seguidores</p>
                    </div>
                    <div>
                        <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>{artist.tracks_count || 0}</p>
                        <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 text-sm`}>tracks</p>
                    </div>
                </div>

                <button
                    onClick={toggleFollow}
                    className={`w-full ${isFollowing
                        ? (isDark ? 'bg-[var(--color-dark-surface)] text-white' : 'bg-gray-200 text-black')
                        : 'bg-[var(--color-brutal-yellow)] text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black flex items-center justify-center gap-2`}
                >
                    {isFollowing ? (
                        <>
                            <BadgeCheck className="w-5 h-5" />
                            SIGUIENDO
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            SEGUIR
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
