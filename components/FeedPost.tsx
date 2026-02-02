import { Heart, MessageCircle, Share2, Play, Music } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

interface FeedPostProps {
  post: {
    id: string;
    user: {
      username: string;
      avatar: string;
    };
    type: "photo" | "video" | "text" | "music";
    mediaUrl: string | null;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
  };
  isDark: boolean;
  onLike: () => void;
  onUserClick: () => void;
  onCommentClick: () => void;
  onPlay?: () => void;
}

export function FeedPost({ post, isDark, onLike, onUserClick, onCommentClick, onPlay }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Post de ${post.user.username} en Sonx`,
      text: post.caption,
      url: window.location.href, // In a real app, this would be the specific post URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} overflow-hidden max-w-lg mx-auto`}>
      {/* User Header */}
      <div className={`p-3 md:p-4 flex items-center gap-3 border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
        <button onClick={onUserClick} className={`w-10 h-10 border-2 ${isDark ? 'border-white' : 'border-black'}`}>
          <ImageWithFallback
            src={post.user.avatar}
            alt={post.user.username}
            className="w-full h-full object-cover"
          />
        </button>
        <div className="flex-1">
          <button onClick={onUserClick} className={`font-black ${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors text-sm md:text-base`}>
            {post.user.username}
          </button>
          <p className={`text-xs ${isDark ? 'text-white' : 'text-black'} opacity-70`}>
            {post.timestamp}
          </p>
        </div>
      </div>

      {/* Media - Only show if not text type and mediaUrl exists */}
      {post.type !== 'text' && post.mediaUrl && (
        <div className="relative aspect-[4/3] bg-black group">
          {post.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-brutal-yellow)] border-4 border-white brutal-shadow-lg flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-black" />
              </button>
            </div>
          )}
          {post.type === "music" && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay && onPlay();
                }}
                className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-brutal-green)] border-4 border-white brutal-shadow-lg flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
              >
                <Music className="w-6 h-6 md:w-8 md:h-8 text-black" />
              </button>
            </div>
          )}
          <ImageWithFallback
            src={post.mediaUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Text Content for Text Posts - Show larger/different style if it's text only */}
      {post.type === 'text' && (
        <div className={`p-6 min-h-[200px] flex items-center justify-center text-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'}`}>
          <p className={`font-black text-xl md:text-2xl ${isDark ? 'text-white' : 'text-black'}`}>
            {post.caption}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="p-3 md:p-4 border-t-4 ${isDark ? 'border-white' : 'border-black'}">
        <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 md:gap-2 ${isLiked ? 'text-red-500' : isDark ? 'text-white' : 'text-black'} hover:scale-110 transition-transform`}
          >
            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-black text-sm md:text-base">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button
            onClick={onCommentClick}
            className={`flex items-center gap-1 md:gap-2 ${isDark ? 'text-white' : 'text-black'} hover:scale-110 transition-transform`}
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-black text-sm md:text-base">{post.comments}</span>
          </button>
          <button
            onClick={handleShare}
            className={`ml-auto ${isDark ? 'text-white' : 'text-black'} hover:scale-110 transition-transform`}
          >
            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Caption - Only show here if NOT text post (since text post shows it in the main body) */}
        {post.type !== 'text' && (
          <p className={`${isDark ? 'text-white' : 'text-black'} text-sm md:text-base`}>
            <span className="font-black">{post.user.username}</span> {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}