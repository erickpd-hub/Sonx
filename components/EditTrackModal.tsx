import { useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner";

interface Track {
    id: string;
    title: string;
    genre?: string;
    description?: string;
    is_public?: boolean;
    audience?: string;
}

interface EditTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    track: Track;
    onUpdate: () => void;
    isDark: boolean;
}

export function EditTrackModal({ isOpen, onClose, track, onUpdate, isDark }: EditTrackModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: track.title,
        genre: track.genre || "",
        description: track.description || "",
        is_public: track.is_public ?? true,
        audience: track.audience || "everyone",
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('tracks')
                .update({
                    title: formData.title,
                    genre: formData.genre,
                    description: formData.description,
                    is_public: formData.is_public,
                    audience: formData.audience
                })
                .eq('id', track.id);

            if (error) throw error;

            toast.success("Track actualizado correctamente");
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error("Error updating track:", error);
            toast.error("Error al actualizar track");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este track? Esta acción no se puede deshacer.")) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('tracks')
                .delete()
                .eq('id', track.id);

            if (error) throw error;

            toast.success("Track eliminado correctamente");
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error("Error deleting track:", error);
            toast.error("Error al eliminar track");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`w-full max-w-md ${isDark ? 'bg-[var(--color-dark-surface)] border-white' : 'bg-white border-black'} border-4 brutal-shadow-xl`}>

                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
                    <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>EDITAR TRACK</h2>
                    <button onClick={onClose} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}>
                        <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">

                    {/* Title */}
                    <div>
                        <label className={`block font-black mb-1 ${isDark ? 'text-white' : 'text-black'}`}>TÍTULO</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full p-2 border-4 ${isDark ? 'bg-[var(--color-dark-bg)] border-white text-white' : 'bg-white border-black text-black'} font-bold focus:outline-none`}
                        />
                    </div>

                    {/* Genre */}
                    <div>
                        <label className={`block font-black mb-1 ${isDark ? 'text-white' : 'text-black'}`}>GÉNERO</label>
                        <input
                            type="text"
                            value={formData.genre}
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            className={`w-full p-2 border-4 ${isDark ? 'bg-[var(--color-dark-bg)] border-white text-white' : 'bg-white border-black text-black'} font-bold focus:outline-none`}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={`block font-black mb-1 ${isDark ? 'text-white' : 'text-black'}`}>DESCRIPCIÓN</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full p-2 border-4 ${isDark ? 'bg-[var(--color-dark-bg)] border-white text-white' : 'bg-white border-black text-black'} font-bold focus:outline-none resize-none`}
                            rows={3}
                        />
                    </div>

                    {/* Visibility */}
                    <div className="flex items-center gap-4">
                        <label className={`flex items-center gap-2 font-black ${isDark ? 'text-white' : 'text-black'}`}>
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                className="w-5 h-5 border-4 border-black"
                            />
                            VISIBLE PÚBLICAMENTE
                        </label>
                    </div>

                    {/* Audience */}
                    <div>
                        <label className={`block font-black mb-1 ${isDark ? 'text-white' : 'text-black'}`}>QUIÉN PUEDE ESCUCHAR</label>
                        <select
                            value={formData.audience}
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                            className={`w-full p-2 border-4 ${isDark ? 'bg-[var(--color-dark-bg)] border-white text-white' : 'bg-white border-black text-black'} font-bold focus:outline-none`}
                        >
                            <option value="everyone">Todos</option>
                            <option value="followers">Solo Seguidores</option>
                            <option value="private">Solo Yo</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className={`flex-1 bg-red-500 border-4 ${isDark ? 'border-white' : 'border-black'} brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-3 font-black text-white flex items-center justify-center gap-2`}
                        >
                            <Trash2 className="w-5 h-5" />
                            ELIMINAR
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`flex-1 bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-3 font-black text-black flex items-center justify-center gap-2`}
                        >
                            <Save className="w-5 h-5" />
                            GUARDAR
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
