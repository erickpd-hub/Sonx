import { X, Image as ImageIcon, Video, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCreatePost } from "../hooks/useCreatePost";
import { toast } from "sonner";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  isDark: boolean;
  onCreatePost: (post: any) => void;
}

export function CreatePostModal({ isOpen, onClose, user, isDark, onCreatePost }: CreatePostModalProps) {
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createPost, uploading } = useCreatePost();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow if there is a file OR if there is a caption (text-only post)
    if (!file && !caption.trim()) {
      toast.error("Por favor añade contenido a tu publicación");
      return;
    }

    try {
      // Infer type: if no file, it's text. If file, use selected mediaType
      const type = file ? mediaType : 'text';

      const newPost = await createPost(user.id, file, caption, type);
      toast.success("Publicación creada exitosamente");
      onCreatePost(newPost); // Notify parent with the real post data
      setCaption("");
      setFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      toast.error("Error al crear la publicación");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-4 flex justify-between items-center border-b-4 ${isDark ? 'border-white' : 'border-black'} sticky top-0 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} z-10`}>
          <h3 className={isDark ? 'text-white' : 'text-black'}>CREAR PUBLICACIÓN</h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-white' : 'text-black'} hover:opacity-70 transition-opacity`}
            disabled={uploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 border-4 ${isDark ? 'border-white' : 'border-black'}`}>
              <ImageWithFallback
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`font-black ${isDark ? 'text-white' : 'text-black'}`}>
              {user.username}
            </span>
          </div>

          {/* Caption */}
          <div className="mb-6">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="¿Qué estás creando?"
              className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none resize-none placeholder:opacity-50`}
              rows={4}
              disabled={uploading}
            />
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-3`}>TIPO DE CONTENIDO (OPCIONAL)</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMediaType("photo");
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className={`${mediaType === "photo" ? 'bg-[var(--color-brutal-yellow)] text-black' : isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-4 flex flex-col items-center gap-2 font-black`}
                disabled={uploading}
              >
                <ImageIcon className="w-8 h-8" />
                FOTO
              </button>
              <button
                type="button"
                className={`${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} opacity-50 cursor-not-allowed p-4 flex flex-col items-center gap-2 font-black`}
                disabled={true}
              >
                <Video className="w-8 h-8" />
                VIDEO (PRÓXIMAMENTE)
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={mediaType === "photo" ? "image/*" : "video/*"}
              className="hidden"
            />

            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-4 border-dashed ${isDark ? 'border-white' : 'border-black'} p-8 text-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'} hover:bg-[var(--color-brutal-yellow)] hover:border-solid transition-all cursor-pointer relative overflow-hidden`}
            >
              {previewUrl ? (
                mediaType === "photo" ? (
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto object-contain" />
                ) : (
                  <video src={previewUrl} controls className="max-h-64 mx-auto" />
                )
              ) : (
                <>
                  <Upload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white' : 'text-black'}`} />
                  <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
                    Arrastra tu {mediaType === "photo" ? "foto" : "video"} aquí
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-black'} text-sm opacity-70`}>
                    o haz clic para seleccionar
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className={`flex-1 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black`}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={uploading || (!file && !caption.trim())}
              className={`flex-1 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PUBLICANDO...
                </>
              ) : (
                "PUBLICAR"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
