import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Player } from "./components/Player";
import { DownloadModal } from "./components/DownloadModal";
import { LoginView } from "./components/LoginView";
import { EditProfileView } from "./components/EditProfileView";
import { DownloadsView } from "./components/DownloadsView";
import { CreatePostModal } from "./components/CreatePostModal";
import { PostDetailsModal } from "./components/PostDetailsModal";
import { DiscoverArtistsPage } from "./views/DiscoverArtistsPage";
import { NotificationsView } from "./components/NotificationsView";
import { UploadView } from "./components/UploadView";
import { SubscriptionView } from "./components/SubscriptionView";
import { ProfileView } from "./components/ProfileView";
import { UserProfilePage } from "./components/UserProfilePage";

import { HomeView } from "./views/HomeView";
import { MusicView } from "./views/MusicView";
import { BeatsView } from "./views/BeatsView";
import { SamplesView } from "./views/SamplesView";
import { GenreView } from "./views/GenreView";
import { PlaylistView } from "./views/PlaylistView";

import { useAuth } from "./components/AuthProvider";
import { useTracks } from "./hooks/useTracks";
import { useProfile } from "./hooks/useProfile";
import { usePlaylists } from "./hooks/usePlaylists";
import { usePosts } from "./hooks/usePosts";
import { useLikeTrack } from "./hooks/useLikeTrack";
import { useLikedTracks } from "./hooks/useLikedTracks";
import { toast } from "sonner";
import { supabase } from "./utils/supabase/client";

export default function App() {
  const { user: authUser, loading, signOut } = useAuth();
  const { profile: userProfile } = useProfile(authUser?.id);
  const { tracks: supabaseTracks, loading: tracksLoading } = useTracks();
  const { playlists: supabasePlaylists } = usePlaylists();
  const { posts: supabasePosts } = usePosts();

  // Like hooks
  const { toggleLike } = useLikeTrack();
  const { likedTrackIds, setLikedTrackIds } = useLikedTracks(authUser?.id);

  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(undefined);
  const [isPremium, setIsPremium] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [trackToDownload, setTrackToDownload] = useState<any>(null);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [postDetailsModalOpen, setPostDetailsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<any[]>([]);

  const [userPosts, setUserPosts] = useState<any[]>([]);

  // Player State
  const [queue, setQueue] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [originalQueue, setOriginalQueue] = useState<any[]>([]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Map Supabase playlists to UI format
  const mockPlaylists = supabasePlaylists.map((p: any) => ({
    id: p.id,
    title: p.title,
    genre: p.genre,
    type: p.type,
    banner: p.banner_url || "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=1080",
    trackCount: p.track_count || 0,
  }));

  // Map Supabase tracks to UI format
  const allTracks = supabaseTracks.map((track: any) => ({
    id: track.id,
    title: track.title,
    artist: track.profiles?.username || "Unknown Artist",
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

  const mockTracks = allTracks.filter((t: any) => t.type === 'music');
  const mockSamples = allTracks.filter((t: any) => t.type === 'sample' || t.type === 'beat');

  // Map Supabase posts to UI format
  const mockPosts = supabasePosts.map((post: any) => ({
    id: post.id,
    user: {
      userId: post.user_id,
      username: post.profiles?.username || "Unknown User",
      avatar: post.profiles?.avatar_url || "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=100"
    },
    type: post.type,
    mediaUrl: post.media_url,
    caption: post.caption || "",
    likes: post.likes,
    comments: post.comments?.[0]?.count || 0,
    timestamp: new Date(post.created_at).toLocaleDateString(),
  }));

  const mockArtists = [
    { id: "a1", username: "MC Brutal", avatar: "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=100", genre: "Hip Hop", followers: 12400, tracks: 24 },
    { id: "a2", username: "DJ Electron", avatar: "https://images.unsplash.com/photo-1712530967389-e4b5b16b8500?w=100", genre: "Electronic", followers: 28900, tracks: 45 },
    { id: "a3", username: "Young Savage", avatar: "https://images.unsplash.com/photo-1717978227404-4d3db15e3d13?w=100", genre: "Trap", followers: 15600, tracks: 18 },
    { id: "a4", username: "Reggatón Star", avatar: "https://images.unsplash.com/photo-1735827168262-551bde1c928b?w=100", genre: "Reggaeton", followers: 34200, tracks: 32 },
    { id: "a5", username: "ProducerPro", avatar: "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=100", genre: "Electronic", followers: 8900, tracks: 15 },
    { id: "a6", username: "Jazz Master", avatar: "https://images.unsplash.com/photo-1503853585905-d53f628e46ac?w=100", genre: "Jazz", followers: 21500, tracks: 38 },
  ];

  const user = authUser ? {
    id: authUser.id,
    username: userProfile?.username || authUser.user_metadata.username || authUser.email?.split('@')[0] || "Usuario",
    avatar: userProfile?.avatar_url || authUser.user_metadata.avatar_url || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjMwODM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: userProfile?.banner_url || "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzYzMTI0ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isPremium: userProfile?.is_premium || isPremium,
    followers: userProfile?.followers_count || 0,
    following: userProfile?.following_count || 0,
    city: userProfile?.city,
    genre: userProfile?.genre,
  } : undefined;

  const handlePlayTrack = (track: any, contextTracks: any[] = allTracks) => {
    const tracksToQueue = contextTracks.length > 0 ? contextTracks : allTracks;
    setOriginalQueue(tracksToQueue);

    if (isShuffled) {
      // If shuffled, create a shuffled version but keep selected track first
      const shuffled = [...tracksToQueue].sort(() => Math.random() - 0.5);
      const trackIndex = shuffled.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        shuffled.splice(trackIndex, 1);
        shuffled.unshift(track);
      }
      setQueue(shuffled);
      setCurrentTrackIndex(0);
    } else {
      setQueue(tracksToQueue);
      const index = tracksToQueue.findIndex((t) => t.id === track.id);
      setCurrentTrackIndex(index !== -1 ? index : 0);
    }

    setCurrentSong({
      ...track,
      image: track.image || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400",
    });
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (queue.length === 0) return;

    let nextIndex = currentTrackIndex + 1;

    if (repeatMode === 'one') {
      // Replay current
      const track = queue[currentTrackIndex];
      setCurrentSong({ ...track, image: track.image || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400" });
      return;
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentTrackIndex(nextIndex);
    const track = queue[nextIndex];
    setCurrentSong({ ...track, image: track.image || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400" });
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (queue.length === 0) return;

    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = 0; // Or wrap around if desired
    }

    setCurrentTrackIndex(prevIndex);
    const track = queue[prevIndex];
    setCurrentSong({ ...track, image: track.image || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400" });
    setIsPlaying(true);
  };

  const handleShuffle = () => {
    const newIsShuffled = !isShuffled;
    setIsShuffled(newIsShuffled);

    if (newIsShuffled) {
      // Shuffle current queue
      const shuffled = [...originalQueue].sort(() => Math.random() - 0.5);
      // Keep current song playing
      if (currentSong) {
        const currentIndex = shuffled.findIndex(t => t.id === currentSong.id);
        if (currentIndex !== -1) {
          shuffled.splice(currentIndex, 1);
          shuffled.unshift(currentSong);
        }
      }
      setQueue(shuffled);
      setCurrentTrackIndex(0);
    } else {
      // Restore original order
      setQueue(originalQueue);
      if (currentSong) {
        const index = originalQueue.findIndex(t => t.id === currentSong.id);
        setCurrentTrackIndex(index !== -1 ? index : 0);
      }
    }
  };

  const handleRepeat = () => {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleLikeTrack = async (trackId: string) => {
    if (!authUser) {
      toast.error("Debes iniciar sesión para dar like");
      return;
    }

    const isLiked = likedTrackIds.includes(trackId);

    // Optimistic update
    setLikedTrackIds(prev =>
      isLiked ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );

    try {
      await toggleLike(authUser.id, trackId, isLiked);
    } catch (error) {
      // Revert on error
      setLikedTrackIds(prev =>
        isLiked ? [...prev, trackId] : prev.filter(id => id !== trackId)
      );
      toast.error("Error al actualizar like");
    }
  };

  const handleDownloadTrack = (trackId: string) => {
    if (!authUser) {
      // setActiveView("login"); // TODO: Redirect to login
      window.location.href = "/login"; // Simple redirect for now, or use useNavigate if we were inside a component
      return;
    }
    const track = mockTracks.find((t) => t.id === trackId) || mockSamples.find((s) => s.id === trackId);
    setTrackToDownload(track);
    setDownloadModalOpen(true);
  };

  const handleConfirmDownload = () => {
    if (trackToDownload) {
      setDownloads((prev) => [...prev, { ...trackToDownload, downloadedTime: "ahora" }]);
    }
  };

  const handleLogin = (_email: string, _password: string) => {
    // Auth handled by Supabase Auth UI/Provider
    // handleNavigation("home"); // TODO: Redirect
    window.location.href = "/";
  };

  const handleRegister = (_email: string, _password: string, _username: string) => {
    // Auth handled by Supabase Auth UI/Provider
    // handleNavigation("home"); // TODO: Redirect
    window.location.href = "/";
  };

  const handleCreatePost = (post: any) => {
    if (!user) return;
    const newPost = {
      id: post.id,
      user: {
        userId: user.id,
        username: user.username,
        avatar: user.avatar
      },
      type: post.type,
      mediaUrl: post.media_url,
      caption: post.caption,
      likes: 0,
      comments: 0,
      timestamp: "ahora",
    };
    setUserPosts((prev) => [newPost, ...prev]);
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId);
    setPostDetailsModalOpen(true);
  };

  const handlePlayPost = (post: any) => {
    // Find track by matching cover image (mediaUrl) and artist (userId)
    const track = allTracks.find(t => t.image === post.mediaUrl && t.artist_id === post.user.userId);
    if (track) {
      handlePlayTrack(track);
    } else {
      toast.error("No se encontró la canción asociada");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar
          isDark={isDark}
          isLoggedIn={!!authUser}
          user={user}
          onLogout={() => {
            signOut();
            // handleNavigation("home"); // Redirect handled by router or state change
            window.location.href = "/";
          }}
          onSearch={(query) => console.log("Search:", query)}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isDark={isDark}
            isPremium={isPremium}
            isLoggedIn={!!authUser}
          />

          <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} pb-24 lg:pb-8`}>
            <Routes>
              <Route path="/" element={
                <HomeView
                  isDark={isDark}
                  authUser={authUser}
                  userPosts={userPosts}
                  mockPosts={mockPosts}
                  mockTracks={mockTracks}
                  mockArtists={mockArtists}
                  tracksLoading={tracksLoading}
                  likedTrackIds={likedTrackIds}
                  onCreatePost={() => setCreatePostModalOpen(true)}
                  onLikePost={(id) => console.log("Like post", id)}
                  onUserClick={(id) => window.location.href = `/profile/${id}`}
                  onCommentClick={handleCommentClick}
                  onPlayTrack={handlePlayTrack}
                  onLikeTrack={handleLikeTrack}
                  onDownloadTrack={handleDownloadTrack}
                  onFollowArtist={(id: string) => console.log("Follow", id)}
                  onArtistClick={(id: string) => window.location.href = `/profile/${id}`}
                  onPlayPost={handlePlayPost}
                />
              } />
              <Route path="/music" element={<MusicView isDark={isDark} />} />
              <Route path="/beats" element={<BeatsView isDark={isDark} />} />
              <Route path="/samples" element={
                <SamplesView
                  isDark={isDark}
                  isPremium={isPremium}
                  mockSamples={mockSamples}
                  likedTrackIds={likedTrackIds}
                  onPlayTrack={handlePlayTrack}
                  onLikeTrack={handleLikeTrack}
                  onDownloadTrack={handleDownloadTrack}
                />
              } />
              <Route path="/downloads" element={
                <DownloadsView
                  isDark={isDark}
                  downloads={downloads}
                  onPlayTrack={handlePlayTrack}
                  onDeleteDownload={(id) => setDownloads(downloads.filter((d) => d.id !== id))}
                />
              } />
              <Route path="/upload" element={
                !authUser ? <Navigate to="/login" /> :
                  <UploadView isDark={isDark} onUploadComplete={(track) => console.log("Track uploaded:", track)} />
              } />
              <Route path="/profile" element={
                !authUser || !user ? <Navigate to="/login" /> :
                  <ProfileView
                    user={user}
                    uploadedTracks={allTracks.filter((t: any) => t.artist_id === authUser.id)}
                    likedTracks={mockTracks.filter((t: any) => likedTrackIds.includes(t.id))}

                    posts={[...userPosts, ...mockPosts].filter(p => p.user.userId === authUser.id)}
                    followers={1240}
                    following={385}
                    onPlayTrack={handlePlayTrack}
                    onLikeTrack={handleLikeTrack}
                    onDownloadTrack={handleDownloadTrack}
                    onLikePost={(id) => console.log("Like post", id)}
                    onCommentClick={handleCommentClick}
                    onPlayPost={handlePlayPost}
                    isDark={isDark}
                    likedTrackIds={likedTrackIds}
                    currentUserId={authUser.id}
                    onTrackUpdate={() => {
                      // Refresh tracks
                      window.location.reload(); // Simple reload for now, ideally we'd refetch
                    }}
                  />
              } />
              <Route path="/profile/edit" element={
                !authUser || !user ? <Navigate to="/login" /> :
                  <EditProfileView
                    isDark={isDark}
                    user={user}
                    onSave={async (data) => {
                      if (!authUser) return;
                      console.log("Saving profile data:", data);
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({
                            username: data.username,
                            bio: data.bio,
                            avatar_url: data.avatar,
                            banner_url: data.banner,
                            city: data.city,
                            genre: data.genre,
                          })
                          .eq('id', authUser.id);

                        if (error) {
                          console.error("Supabase update error:", error);
                          throw error;
                        }

                        console.log("Profile updated successfully in DB");
                        // Force reload to get fresh data
                        window.location.href = "/profile";
                      } catch (error: any) {
                        console.error('Error updating profile:', error);
                        toast.error(`Error al actualizar perfil: ${error.message || "Error desconocido"}`);
                        throw error; // Re-throw so EditProfileView knows it failed
                      }
                    }}
                  />
              } />
              <Route path="/artists" element={
                <DiscoverArtistsPage isDark={isDark} />
              } />
              <Route path="/subscription" element={
                <SubscriptionView
                  isDark={isDark}
                  isPremium={isPremium}
                  onSubscribe={() => setIsPremium(true)}
                />
              } />
              <Route path="/login" element={<LoginView isDark={isDark} onLogin={handleLogin} onRegister={handleRegister} />} />
              <Route path="/notifications" element={
                <NotificationsView
                  isDark={isDark}
                  userId={authUser?.id}
                />
              } />
              <Route path="/genre/:id" element={<GenreView isDark={isDark} mockPlaylists={mockPlaylists} />} />
              <Route path="/playlist/:id" element={
                <PlaylistView
                  isDark={isDark}
                  mockPlaylists={mockPlaylists}
                  mockTracks={mockTracks}
                  likedTrackIds={likedTrackIds}
                  onPlayTrack={handlePlayTrack}
                  onLikeTrack={handleLikeTrack}
                  onDownloadTrack={handleDownloadTrack}
                />
              } />
              <Route path="/profile/:userId" element={
                <UserProfilePage
                  isDark={isDark}
                  onPlayTrack={handlePlayTrack}
                  onLikeTrack={handleLikeTrack}
                  onDownloadTrack={handleDownloadTrack}
                  onLikePost={(id: string) => console.log("Like post", id)}
                  onCommentClick={handleCommentClick}
                  onPlayPost={handlePlayPost}
                />
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>

        {currentSong && (
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onClose={() => {
              setIsPlaying(false);
              setCurrentSong(undefined);
            }}
            isDark={isDark}
            isLiked={likedTrackIds.includes(currentSong.id)}
            onLike={() => authUser && toggleLike(authUser.id, currentSong.id, likedTrackIds.includes(currentSong.id))}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onShuffle={handleShuffle}
            onRepeat={handleRepeat}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
          />
        )}

        <DownloadModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          trackTitle={trackToDownload?.title || ""}
          isPremium={isPremium}
          onConfirmDownload={handleConfirmDownload}
          isDark={isDark}
        />

        {user && (
          <CreatePostModal
            isOpen={createPostModalOpen}
            onClose={() => setCreatePostModalOpen(false)}
            user={user}
            isDark={isDark}
            onCreatePost={handleCreatePost}
          />
        )}

        {user && (
          <PostDetailsModal
            isOpen={postDetailsModalOpen}
            onClose={() => setPostDetailsModalOpen(false)}
            post={[...userPosts, ...mockPosts].find(p => p.id === selectedPostId)}
            user={user}
            isDark={isDark}
            onLike={() => console.log("Like post")}
            onUserClick={() => console.log("User clicked")}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
