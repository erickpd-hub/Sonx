import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Check } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface ImagePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (fileOrUrl: File | string) => void;
    userId: string;
    bucketFolder: 'avatars' | 'banners';
    isDark: boolean;
}

export function ImagePickerModal({ isOpen, onClose, onSelect, userId, bucketFolder, isDark }: ImagePickerModalProps) {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen, userId, bucketFolder]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            // List files in the specific folder
            const { data, error } = await supabase.storage
                .from('images')
                .list(`${bucketFolder}/${userId}`, {
                    limit: 20,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) throw error;

            if (data) {
                const urls = data.map(file => {
                    const { data: { publicUrl } } = supabase.storage
                        .from('images')
                        .getPublicUrl(`${bucketFolder}/${userId}/${file.name}`);
                    return publicUrl;
                });
                setImages(urls);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            // Don't show toast here to avoid spamming if folder is empty/missing
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSelect(file);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`w-full max-w-2xl max-h-[80vh] flex flex-col ${isDark ? 'bg-[var(--color-dark-surface)] border-white' : 'bg-white border-black'} border-4 brutal-shadow-xl`}>

                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
                    <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                        <ImageIcon className="w-6 h-6" />
                        SELECCIONAR IMAGEN
                    </h2>
                    <button onClick={onClose} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}>
                        <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Upload Section */}
                    <div className="mb-8">
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-4 border-dashed ${isDark ? 'border-gray-600 hover:border-white' : 'border-gray-300 hover:border-black'} cursor-pointer transition-colors group`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className={`w-8 h-8 mb-2 ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black'}`} />
                                <p className={`text-sm font-black ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black'}`}>
                                    SUBIR DESDE DISPOSITIVO
                                </p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                    </div>

                    {/* History Section */}
                    <div>
                        <h3 className={`font-black mb-4 ${isDark ? 'text-white' : 'text-black'}`}>HISTORIAL</h3>
                        {loading ? (
                            <div className="text-center py-8">Cargando...</div>
                        ) : images.length === 0 ? (
                            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No hay imágenes anteriores
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            onSelect(url);
                                            onClose();
                                        }}
                                        className={`relative aspect-square border-4 ${isDark ? 'border-transparent hover:border-white' : 'border-transparent hover:border-black'} transition-all group overflow-hidden`}
                                    >
                                        <ImageWithFallback
                                            src={url}
                                            alt={`History ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                            <Check className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
