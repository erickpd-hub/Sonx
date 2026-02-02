import { useNavigate } from "react-router-dom";
import { useRecommendedArtists } from "../hooks/useRecommendedArtists";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserPlus, BadgeCheck, Loader2 } from "lucide-react";
import { useFollow } from "../hooks/useFollow";

interface ArtistDiscoveryPanelProps {
    isDark: boolean;
}

function ArtistItem({ artist, isDark }: { artist: any, isDark: boolean }) {
    const navigate = useNavigate();
    const { isFollowing, toggleFollow } = useFollow(artist.id);

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => navigate(`/profile/${artist.id}`)}
                className={`w-12 h-12 border-2 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0`}
            >
                <ImageWithFallback
                    src={artist.avatar_url || "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=100"}
                    alt={artist.username}
                    className="w-full h-full object-cover"
                />
            </button>
            <div className="flex-1 min-w-0 text-left">
                <button
                    onClick={() => navigate(`/profile/${artist.id}`)}
                    className={`font-black truncate w-full text-left hover:underline ${isDark ? 'text-white' : 'text-black'}`}
                >
                    {artist.username}
                </button>
                <p className={`text-xs truncate ${isDark ? 'text-white' : 'text-black'} opacity-70`}>
                    {artist.genre || "Artista"}
                </p>
            </div>
            <button
                onClick={toggleFollow}
                className={`p-2 border-2 ${isDark ? 'border-white' : 'border-black'} ${isFollowing ? (isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-gray-200') : 'bg-[var(--color-brutal-yellow)]'} hover:scale-105 transition-transform`}
                title={isFollowing ? "Dejar de seguir" : "Seguir"}
            >
                {isFollowing ? (
                    <BadgeCheck className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
                ) : (
                    <UserPlus className="w-4 h-4 text-black" />
                )}
            </button>
        </div>
    );
}

export function ArtistDiscoveryPanel({ isDark }: ArtistDiscoveryPanelProps) {
    const { artists, loading } = useRecommendedArtists();
    const navigate = useNavigate();

    // Show top 5 recommendations
    const displayedArtists = artists.slice(0, 5);

    return (
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6 sticky top-24`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`font-black ${isDark ? 'text-white' : 'text-black'}`}>
                    ARTISTAS SUGERIDOS
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-white' : 'text-black'}`} />
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedArtists.length === 0 ? (
                        <p className={`text-sm ${isDark ? 'text-white' : 'text-black'} opacity-70`}>
                            No hay sugerencias por el momento.
                        </p>
                    ) : (
                        displayedArtists.map((artist) => (
                            <ArtistItem key={artist.id} artist={artist} isDark={isDark} />
                        ))
                    )}
                </div>
            )}

            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
                <button
                    onClick={() => navigate('/artists')}
                    className={`w-full py-2 font-black text-sm hover:underline ${isDark ? 'text-white' : 'text-black'}`}
                >
                    VER TODOS LOS ARTISTAS
                </button>
            </div>
        </div>
    );
}
