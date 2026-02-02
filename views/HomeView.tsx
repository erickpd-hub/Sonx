import { Plus } from "lucide-react";
import { FeedPost } from "../components/FeedPost";
import { TrackList } from "../components/TrackList";
import { ArtistDiscoveryPanel } from "../components/ArtistDiscoveryPanel";

interface HomeViewProps {
    isDark: boolean;
    authUser: any;
    userPosts: any[];
    mockPosts: any[];
    mockTracks: any[];
    mockArtists: any[];
    tracksLoading: boolean;
    likedTrackIds: string[];
    onCreatePost: () => void;
    onLikePost: (id: string) => void;
    onUserClick: (id: string) => void;
    onCommentClick: (id: string) => void;
    onPlayTrack: (track: any, context?: any[]) => void;
    onPlayPost?: (post: any) => void;
    onLikeTrack: (id: string) => void;
    onDownloadTrack: (id: string) => void;
    onFollowArtist: (id: string) => void;
    onArtistClick: (id: string) => void;
}

export function HomeView({
    isDark,
    authUser,
    userPosts,
    mockPosts,
    mockTracks,
    mockArtists,
    tracksLoading,
    likedTrackIds,
    onCreatePost,
    onLikePost,
    onUserClick,
    onCommentClick,
    onPlayTrack,
    onLikeTrack,
    onDownloadTrack,
    onFollowArtist,
    onArtistClick,
    onPlayPost,
}: HomeViewProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            {/* Main Feed */}
            <div>
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                            <h1 className="text-black">DESCUBRE</h1>
                        </div>
                        <p className={isDark ? 'text-white' : 'text-black'}>
                            Explora nueva música y beats de artistas emergentes
                        </p>
                    </div>
                    {authUser && (
                        <button
                            onClick={onCreatePost}
                            className={`bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-black text-black flex items-center gap-2`}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">CREAR PUBLICACIÓN</span>
                        </button>
                    )}
                </div>

                {/* Feed Posts */}
                {authUser && (
                    <section className="mb-8 space-y-6">
                        {[...userPosts, ...mockPosts].map((post) => (
                            <FeedPost
                                key={post.id}
                                post={post}
                                isDark={isDark}
                                onLike={() => onLikePost(post.id)}
                                onUserClick={() => onUserClick(post.user.username)}
                                onCommentClick={() => onCommentClick(post.id)}
                                onPlay={() => onPlayPost && onPlayPost(post)}
                            />
                        ))}
                    </section>
                )}

                {/* Trending Tracks */}
                <section>
                    <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-2 mb-6 inline-block`}>
                        <h3 className={isDark ? 'text-white' : 'text-black'}>TENDENCIAS</h3>
                    </div>
                    <TrackList
                        tracks={mockTracks.slice(0, 5)}
                        onPlayTrack={onPlayTrack}
                        onLikeTrack={onLikeTrack}
                        onDownloadTrack={onDownloadTrack}
                        isDark={isDark}
                        likedTracks={likedTrackIds}
                        isLoading={tracksLoading}
                    />
                </section>
            </div>

            {/* Artist Discovery Panel */}
            <div className="hidden xl:block">
                <ArtistDiscoveryPanel isDark={isDark} />
            </div>
        </div>
    );
}
