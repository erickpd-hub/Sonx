import { X, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useComments } from "../hooks/useComments";
import { toast } from "sonner";

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string | null;
    user: {
        id: string;
        username: string;
        avatar: string;
    } | null;
    isDark: boolean;
}

export function CommentsModal({ isOpen, onClose, postId, user, isDark }: CommentsModalProps) {
    const [newComment, setNewComment] = useState("");
    const { comments, loading, addComment } = useComments(postId);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !postId) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            await addComment(user.id, newComment);
            setNewComment("");
            toast.success("Comentario añadido");
        } catch (error) {
            toast.error("Error al añadir comentario");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} max-w-lg w-full h-[80vh] flex flex-col`}>
                {/* Header */}
                <div className={`p-4 flex justify-between items-center border-b-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'}`}>
                    <h3 className={isDark ? 'text-white' : 'text-black'}>COMENTARIOS</h3>
                    <button
                        onClick={onClose}
                        className={`${isDark ? 'text-white' : 'text-black'} hover:opacity-70 transition-opacity`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white' : 'text-black'}`} />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className={`text-center p-8 ${isDark ? 'text-white' : 'text-black'} opacity-50`}>
                            No hay comentarios aún. ¡Sé el primero!
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <div className={`w-10 h-10 border-2 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0`}>
                                    <ImageWithFallback
                                        src={comment.profiles.avatar_url || "https://via.placeholder.com/150"}
                                        alt={comment.profiles.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className={`flex-1 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'} p-3 border-2 ${isDark ? 'border-white' : 'border-black'}`}>
                                    <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                                        {comment.profiles.username}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                {user ? (
                    <form onSubmit={handleSubmit} className={`p-4 border-t-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'}`}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className={`flex-1 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-2 font-black focus:outline-none`}
                                disabled={submitting}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className={`bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-2 hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {submitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                                ) : (
                                    <Send className="w-6 h-6 text-black" />
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={`p-4 border-t-4 ${isDark ? 'border-white' : 'border-black'} text-center`}>
                        <p className={isDark ? 'text-white' : 'text-black'}>Inicia sesión para comentar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
