import { X, Heart, MessageCircle, Share2, Play } from "lucide-react";
import { CommentsSection } from "./CommentsSection";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
    user: any;
    isDark: boolean;
    onLike: () => void;
    onUserClick: () => void;
}

export function PostDetailsModal({ isOpen, onClose, post, user, isDark, onLike, onUserClick }: PostDetailsModalProps) {
    const [isLiked, setIsLiked] = useState(false);

    if (!isOpen || !post) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike();
    };

    const handleShare = async () => {
        const shareData = {
            title: `Post de ${post.user.username} en Sonx`,
            text: post.caption,
            url: window.location.href,
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 md:p-4">
            <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} w-full max-w-5xl h-full md:h-[80vh] flex flex-col md:flex-row relative overflow-hidden md:border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 z-20 p-2 ${isDark ? 'bg-black text-white border-white' : 'bg-white text-black border-black'} border-2 hover:scale-110 transition-transform`}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Column: Media Content */}
                <div className={`w-full md:w-[60%] lg:w-[65%] bg-black flex items-center justify-center relative overflow-hidden`}>
                    {post.type !== 'text' && post.mediaUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {post.type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                    <button className="w-16 h-16 bg-[var(--color-brutal-yellow)] border-4 border-white brutal-shadow-lg flex items-center justify-center opacity-80">
                                        <Play className="w-8 h-8 fill-black" />
                                    </button>
                                </div>
                            )}
                            <ImageWithFallback
                                src={post.mediaUrl}
                                alt="Post"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center p-8 text-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'}`}>
                            <p className={`font-black text-xl md:text-3xl ${isDark ? 'text-white' : 'text-black'}`}>
                                {post.caption}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: Details & Comments */}
                <div className={`w-full md:w-[40%] lg:w-[35%] flex flex-col h-full ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-l-0 md:border-l-4 ${isDark ? 'border-white' : 'border-black'}`}>

                    {/* Header: User Info */}
                    <div className={`p-4 flex items-center gap-3 border-b-4 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0`}>
                        <button onClick={onUserClick} className={`w-10 h-10 border-2 ${isDark ? 'border-white' : 'border-black'}`}>
                            <ImageWithFallback
                                src={post.user.avatar}
                                alt={post.user.username}
                                className="w-full h-full object-cover"
                            />
                        </button>
                        <div className="flex-1">
                            <button onClick={onUserClick} className={`font-black ${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors`}>
                                {post.user.username}
                            </button>
                            <p className={`text-xs ${isDark ? 'text-white' : 'text-black'} opacity-70`}>
                                {post.timestamp}
                            </p>
                        </div>
                    </div>

                    {/* Description & Stats */}
                    <div className={`p-4 border-b-4 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0 overflow-y-auto max-h-[200px]`}>
                        {post.type !== 'text' && (
                            <p className={`${isDark ? 'text-white' : 'text-black'} mb-4`}>
                                {post.caption}
                            </p>
                        )}

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : isDark ? 'text-white' : 'text-black'} hover:scale-110 transition-transform`}
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500' : ''}`} />
                                <span className="font-black">{post.likes + (isLiked ? 1 : 0)}</span>
                            </button>
                            <div className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
                                <MessageCircle className="w-6 h-6" />
                                <span className="font-black">{post.comments}</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className={`ml-auto ${isDark ? 'text-white' : 'text-black'} hover:scale-110 transition-transform`}
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex-1 overflow-hidden">
                        <CommentsSection
                            postId={post.id}
                            user={user}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
