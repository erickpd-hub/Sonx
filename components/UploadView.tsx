import { Upload, Music, Disc3, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface UploadViewProps {
  isDark: boolean;
  onUploadComplete: (track: any) => void;
}

export function UploadView({ isDark, onUploadComplete }: UploadViewProps) {
  const [uploadType, setUploadType] = useState<'music' | 'beat' | 'sample'>('music');
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    file: null as File | null,
    coverFile: null as File | null,
    // Sample specific fields
    bpm: '',
    note: '',
    sampleType: '',
  });

  const genres = [
    'Hip Hop', 'Trap', 'Reggaeton', 'Pop', 'Rock', 'Electronic',
    'R&B', 'Jazz', 'Blues', 'Country', 'Metal', 'Indie',
    'Corridos', 'Regional'
  ];

  const sampleTypes = ['Drums', 'Lead', 'Pads', 'Plucks', 'Vocal Chop', 'Melodía'];
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !user) return;

    setUploading(true);
    try {
      // 1. Upload file to Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      // 2. Upload Cover Image (if exists)
      let coverUrl = "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400"; // Default

      if (formData.coverFile) {
        const coverExt = formData.coverFile.name.split('.').pop();
        const coverName = `${user.id}/${Date.now()}_cover.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from('images')
          .upload(coverName, formData.coverFile);

        if (coverError) throw coverError;

        const { data: { publicUrl: publicCoverUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(coverName);

        coverUrl = publicCoverUrl;
      }

      // 3. Get Public URL for Audio
      const { data: { publicUrl } } = supabase.storage
        .from('tracks')
        .getPublicUrl(fileName);

      // 4. Insert into Database
      const { data: trackData, error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: formData.title,
          artist_id: user.id,
          genre: formData.genre,
          type: uploadType,
          media_url: publicUrl,
          image_url: coverUrl,
          bpm: uploadType === 'sample' ? formData.bpm : null,
          note: uploadType === 'sample' ? formData.note : null,
          duration: '0:00', // We would need to calculate this
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 5. Create Feed Post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          type: 'music',
          media_url: coverUrl, // Use cover image for the feed post
          caption: `Nuevo lanzamiento: ${formData.title} - ${formData.genre} 🎵`,
          likes: 0
        });

      if (postError) {
        console.error('Error creating feed post:', postError);
        // Don't throw here, as track upload was successful
      }

      toast.success("Subida exitosa!");
      onUploadComplete(trackData);

      setFormData({ title: '', genre: '', file: null, coverFile: null, bpm: '', note: '', sampleType: '' });
      setCoverPreview(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Error al subir: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const typeButtons = [
    { id: 'music' as const, icon: Music, label: 'Música', color: 'bg-[var(--color-brutal-blue)]' },
    { id: 'beat' as const, icon: Disc3, label: 'Beat', color: 'bg-[var(--color-brutal-orange)]' },
    { id: 'sample' as const, icon: Sparkles, label: 'Sample', color: 'bg-[var(--color-brutal-green)]' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
          <h1 className="text-black">SUBIR CONTENIDO</h1>
        </div>
        <p className={isDark ? 'text-white' : 'text-black'}>
          Comparte tu música con la comunidad
        </p>
      </div>

      {/* Type Selection */}
      <div className="mb-6">
        <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-3`}>TIPO DE CONTENIDO</p>
        <div className="grid grid-cols-3 gap-4">
          {typeButtons.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setUploadType(type.id)}
                className={`${uploadType === type.id ? type.color : isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-4 flex flex-col items-center gap-2`}
              >
                <Icon className={`w-8 h-8 ${uploadType === type.id ? 'text-black' : isDark ? 'text-white' : 'text-black'}`} />
                <span className={`font-black ${uploadType === type.id ? 'text-black' : isDark ? 'text-white' : 'text-black'}`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6 space-y-6`}>
        {/* Title */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            TÍTULO *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
            placeholder="Nombre de tu track"
            required
          />
        </div>

        {/* Genre */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            GÉNERO *
          </label>
          <select
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
            required
          >
            <option value="">Selecciona un género</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Sample-specific fields */}
        {uploadType === 'sample' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BPM */}
              <div>
                <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
                  BPM *
                </label>
                <input
                  type="number"
                  value={formData.bpm}
                  onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                  className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none`}
                  placeholder="120"
                  min="1"
                  max="300"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
                  NOTA *
                </label>
                <select
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none`}
                  required
                >
                  <option value="">Nota</option>
                  {notes.map((note) => (
                    <option key={note} value={note}>{note}</option>
                  ))}
                </select>
              </div>

              {/* Sample Type */}
              <div>
                <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
                  TIPO *
                </label>
                <select
                  value={formData.sampleType}
                  onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                  className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none`}
                  required
                >
                  <option value="">Tipo</option>
                  {sampleTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* Cover Image Upload */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            PORTADA (OPCIONAL)
          </label>
          <div className={`border-4 border-dashed ${isDark ? 'border-white' : 'border-black'} p-8 text-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'} hover:bg-[var(--color-brutal-yellow)] hover:border-solid transition-all cursor-pointer relative overflow-hidden`}>
            {coverPreview ? (
              <div className="relative group">
                <img src={coverPreview} alt="Cover Preview" className="w-32 h-32 mx-auto object-cover border-4 border-black" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-black">CAMBIAR</p>
                </div>
              </div>
            ) : (
              <>
                <ImageIcon className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white' : 'text-black'}`} />
                <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
                  Arrastra tu portada aquí
                </p>
                <p className={`${isDark ? 'text-white' : 'text-black'} text-sm opacity-70`}>
                  o haz clic para seleccionar (JPG, PNG)
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...formData, coverFile: file });
                  setCoverPreview(URL.createObjectURL(file));
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block`}>
            ARCHIVO DE AUDIO *
          </label>
          <div className={`border-4 border-dashed ${isDark ? 'border-white' : 'border-black'} p-8 text-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-50'} hover:bg-[var(--color-brutal-yellow)] hover:border-solid transition-all cursor-pointer relative`}>
            {formData.file ? (
              <div className="flex flex-col items-center">
                <Music className={`w-12 h-12 mb-3 ${isDark ? 'text-white' : 'text-black'}`} />
                <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>
                  {formData.file.name}
                </p>
                <p className={`${isDark ? 'text-white' : 'text-black'} text-sm opacity-70`}>
                  {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white' : 'text-black'}`} />
                <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
                  Arrastra tu archivo aquí
                </p>
                <p className={`${isDark ? 'text-white' : 'text-black'} text-sm opacity-70`}>
                  o haz clic para seleccionar (MP3, WAV, FLAC)
                </p>
              </>
            )}
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-4 font-black text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          {uploading ? 'SUBIENDO...' : `SUBIR ${uploadType === 'music' ? 'MÚSICA' : uploadType === 'beat' ? 'BEAT' : 'SAMPLE'}`}
        </button>
      </form>


    </div>
  );
}