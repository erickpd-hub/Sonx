import { Download, Play, Trash2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DownloadsViewProps {
  isDark: boolean;
  downloads: any[];
  onPlayTrack: (track: any, context?: any[]) => void;
  onDeleteDownload: (id: string) => void;
}

export function DownloadsView({ isDark, downloads, onPlayTrack, onDeleteDownload }: DownloadsViewProps) {
  return (
    <div>
      <div className="mb-8">
        <div className={`inline-block bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
          <h1 className="text-black">MIS DESCARGAS</h1>
        </div>
        <p className={isDark ? 'text-white' : 'text-black'}>
          Escucha tu música descargada sin conexión a internet
        </p>
      </div>

      {downloads.length === 0 ? (
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-12 text-center`}>
          <Download className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-white' : 'text-black'} opacity-50`} />
          <p className={`${isDark ? 'text-white' : 'text-black'} text-xl font-black mb-2`}>
            No tienes descargas aún
          </p>
          <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>
            Descarga música y samples para escucharlos sin conexión
          </p>
        </div>
      ) : (
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-4 md:p-6`}>
          <div className="space-y-3">
            {downloads.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}
              >
                <div className={`w-16 h-16 border-4 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0`}>
                  <ImageWithFallback
                    src={item.image || "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=200"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`${isDark ? 'text-white' : 'text-black'} truncate`}>{item.title}</h4>
                  <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 truncate text-sm`}>
                    {item.artist}
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-black'} opacity-50 text-xs mt-1`}>
                    Descargado hace {item.downloadedTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlayTrack(item, downloads)}
                    className={`w-12 h-12 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
                  >
                    <Play className="w-5 h-5 fill-black" />
                  </button>
                  <button
                    onClick={() => onDeleteDownload(item.id)}
                    className={`w-12 h-12 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
