import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Music, Heart, Settings, FileImage, BadgeCheck } from "lucide-react";
import { FeedPost } from "./FeedPost";
import { TrackList } from "./TrackList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileViewProps {
  user: {
    username: string;
    avatar: string;
    banner: string;
    isPremium: boolean;
  };
  uploadedTracks: any[];
  likedTracks: any[];

  posts: any[];
  followers: number;
  following: number;
  onPlayTrack: (track: any, context?: any[]) => void;
  onLikeTrack: (trackId: string) => void;
  onDownloadTrack: (trackId: string) => void;
  onLikePost?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
  onPlayPost?: (post: any) => void;
  isDark: boolean;
  likedTrackIds: string[];
  currentUserId?: string;
  onTrackUpdate?: () => void;
  isOwner?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
}

export function ProfileView({
  user,
  uploadedTracks,
  likedTracks,

  posts,
  followers,
  following,
  onPlayTrack,
  onLikeTrack,
  onDownloadTrack,
  onLikePost,
  onCommentClick,
  onPlayPost,
  isDark,
  likedTrackIds,
  currentUserId,
  onTrackUpdate,
  isOwner = false,
  isFollowing = false,
  onToggleFollow
}: ProfileViewProps) {
  const navigate = useNavigate();
  const tabs = [
    { id: "uploaded", icon: Music, label: "Mi Música", count: uploadedTracks.length },
    { id: "posts", icon: FileImage, label: "Publicaciones", count: posts.length },
    { id: "liked", icon: Heart, label: "Me Gusta", count: likedTracks.length },
  ];

  const [activeTab, setActiveTab] = useState("uploaded");

  const getCurrentContent = () => {
    switch (activeTab) {
      case "uploaded":
        return (
          <TrackList
            tracks={uploadedTracks}
            onPlayTrack={onPlayTrack}
            onLikeTrack={onLikeTrack}
            onDownloadTrack={onDownloadTrack}
            isDark={isDark}
            likedTracks={likedTrackIds}
            currentUserId={currentUserId}
            onTrackUpdate={onTrackUpdate}
          />
        );
      case "posts":
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <FeedPost
                key={post.id}
                post={post}
                isDark={isDark}
                onLike={() => onLikePost && onLikePost(post.id)}
                onUserClick={() => { }} // Already on profile
                onCommentClick={() => onCommentClick && onCommentClick(post.id)}
                onPlay={() => onPlayPost && onPlayPost(post)}
              />
            ))}
            {posts.length === 0 && (
              <div className={`col-span-full ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} p-12 text-center`}>
                <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>
                  No has publicado nada aún
                </p>
              </div>
            )}
          </div>
        );
      case "liked":
        return (
          <TrackList
            tracks={likedTracks}
            onPlayTrack={onPlayTrack}
            onLikeTrack={onLikeTrack}
            onDownloadTrack={onDownloadTrack}
            isDark={isDark}
            likedTracks={likedTrackIds}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner and Avatar */}
      <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} overflow-hidden`}>
        <div className={`h-48 relative border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
          <ImageWithFallback
            src={user.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative">
          <div className={`w-32 h-32 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'}`}>
            <ImageWithFallback
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2">
                <h2 className={isDark ? 'text-white' : 'text-black'}>{user.username}</h2>
                {user.isPremium && (
                  <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/20" />
                )}
              </div>
              {user.isPremium && (
                <span className={`bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} px-3 py-1 font-black text-black inline-block`}>
                  ⭐ PREMIUM
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              <div>
                <span className={`${isDark ? 'text-white' : 'text-black'} font-black`}>{uploadedTracks.length}</span>
                <span className={`${isDark ? 'text-white' : 'text-black'} opacity-70 ml-1`}>tracks</span>
              </div>
              <button className={`${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors`}>
                <span className="font-black">{followers}</span>
                <span className="opacity-70 ml-1">seguidores</span>
              </button>
              <button className={`${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors`}>
                <span className="font-black">{following}</span>
                <span className="opacity-70 ml-1">siguiendo</span>
              </button>
            </div>
          </div>
          {isOwner ? (
            <button
              onClick={() => navigate('/profile/edit')}
              className={`${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-black flex items-center gap-2`}>
              <Settings className="w-5 h-5" />
              <span className="hidden md:inline">EDITAR PERFIL</span>
            </button>
          ) : (
            <button
              onClick={onToggleFollow}
              className={`${isFollowing
                ? (isDark ? 'bg-[var(--color-dark-surface)] text-white' : 'bg-gray-200 text-black')
                : 'bg-[var(--color-brutal-yellow)] text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-black flex items-center gap-2`}>
              {isFollowing ? (
                <>
                  <BadgeCheck className="w-5 h-5" />
                  <span className="hidden md:inline">SIGUIENDO</span>
                </>
              ) : (
                <>
                  <span className="hidden md:inline">SEGUIR</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 border-4 ${isDark ? 'border-white' : 'border-black'} transition-all font-black ${activeTab === tab.id
                ? 'bg-[var(--color-brutal-yellow)] text-black translate-x-1 translate-y-1'
                : `${isDark ? 'bg-[var(--color-dark-surface)] text-white' : 'bg-white text-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none`
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-black'} ${activeTab === tab.id ? 'text-white' : isDark ? 'text-white' : 'text-white'} px-2 py-1 rounded-full text-sm`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {getCurrentContent()}
    </div>
  );
}