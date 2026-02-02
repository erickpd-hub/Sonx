import { useState } from "react";
import { Upload, Save, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner";
import { ImagePickerModal } from "./ImagePickerModal";

interface EditProfileViewProps {
  isDark: boolean;
  user: {
    id: string;
    username: string;
    avatar: string;
    banner: string;
    bio?: string;
    city?: string;
    genre?: string;
  };
  onSave: (data: any) => Promise<void> | void;
}

export function EditProfileView({ isDark, user, onSave }: EditProfileViewProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || "",
    city: user.city || "",
    genre: user.genre || "",
    avatar: user.avatar,
    banner: user.banner,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<'avatar' | 'banner' | null>(null);

  const handleImageUpload = async (file: File, path: string) => {
    try {
      if (!file) throw new Error("No file provided");
      if (!path) throw new Error("No path provided");

      const fileExt = file.name.split('.').pop();
      const fileName = `${path}/${Date.now()}.${fileExt}`;

      console.log(`Attempting to upload file: ${fileName} to bucket: images`);

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      console.log("Upload successful, public URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = formData.avatar;
      let bannerUrl = formData.banner;

      if (avatarFile) {
        avatarUrl = await handleImageUpload(avatarFile, `avatars/${user.id}`);
      }

      if (bannerFile) {
        bannerUrl = await handleImageUpload(bannerFile, `banners/${user.id}`);
      }

      await onSave({
        ...formData,
        avatar: avatarUrl,
        banner: bannerUrl
      });

      toast.success("Perfil actualizado correctamente");

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Error al actualizar perfil: ${error.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (fileOrUrl: File | string, type: 'avatar' | 'banner') => {
    if (fileOrUrl instanceof File) {
      // It's a new file
      const previewUrl = URL.createObjectURL(fileOrUrl);
      if (type === 'avatar') {
        setAvatarFile(fileOrUrl);
        setFormData(prev => ({ ...prev, avatar: previewUrl }));
      } else {
        setBannerFile(fileOrUrl);
        setFormData(prev => ({ ...prev, banner: previewUrl }));
      }
    } else {
      // It's an existing URL
      if (type === 'avatar') {
        setAvatarFile(null); // Clear any pending file upload
        setFormData(prev => ({ ...prev, avatar: fileOrUrl }));
      } else {
        setBannerFile(null);
        setFormData(prev => ({ ...prev, banner: fileOrUrl }));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3`}>
          <h1 className="text-black">EDITAR PERFIL</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className={`${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-black flex items-center gap-2`}
        >
          <X className="w-5 h-5" />
          CANCELAR
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner */}
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} overflow-hidden`}>
          <div className="p-4 border-b-4 ${isDark ? 'border-white' : 'border-black'}">
            <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>BANNER</p>
          </div>
          <div className="relative h-48 group">
            <ImageWithFallback
              src={formData.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <button
                type="button"
                onClick={() => setActiveModal('banner')}
                className="opacity-0 group-hover:opacity-100 bg-[var(--color-brutal-yellow)] border-4 border-white brutal-shadow px-6 py-3 font-black text-black flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Upload className="w-5 h-5" />
                CAMBIAR BANNER
              </button>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
          <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-4`}>FOTO DE PERFIL</p>
          <div className="flex items-center gap-6">
            <div className={`w-32 h-32 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} relative group`}>
              <ImageWithFallback
                src={formData.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('avatar')}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Upload className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('avatar')}
              className={`${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-black flex items-center gap-2`}
            >
              <Upload className="w-5 h-5" />
              CAMBIAR FOTO
            </button>
          </div>
        </div>

        {/* Username */}
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            NOMBRE DE USUARIO
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
            required
          />
        </div>

        {/* Bio */}
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            BIOGRAFÍA
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all resize-none`}
            rows={4}
            placeholder="Cuéntanos sobre tu música..."
          />
        </div>

        {/* City and Genre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
            <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
              CIUDAD
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
              placeholder="Ej. Ciudad de México"
            />
          </div>

          <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
            <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
              GÉNERO FAVORITO
            </label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
            >
              <option value="">Selecciona un género</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Electronic">Electronic</option>
              <option value="Trap">Trap</option>
              <option value="Reggaeton">Reggaeton</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="R&B">R&B</option>
              <option value="Latin">Latin</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-4 font-black text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Save className="w-6 h-6" />
          {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
        </button>
      </form>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        onSelect={(fileOrUrl) => activeModal && handleImageSelect(fileOrUrl, activeModal)}
        userId={user.id}
        bucketFolder={activeModal === 'avatar' ? 'avatars' : 'banners'}
        isDark={isDark}
      />
    </div>
  );
}
