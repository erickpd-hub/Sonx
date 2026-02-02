import { X, Download } from "lucide-react";
import { useState } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  isPremium: boolean;
  onConfirmDownload: () => void;
  isDark: boolean;
}

export function DownloadModal({ isOpen, onClose, trackTitle, isPremium, onConfirmDownload, isDark }: DownloadModalProps) {
  const [adWatched, setAdWatched] = useState(false);
  const [countdown, setCountdown] = useState(5);

  if (!isOpen) return null;

  const handleWatchAd = () => {
    // Simular anuncio con countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdWatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDownload = () => {
    onConfirmDownload();
    onClose();
    setAdWatched(false);
    setCountdown(5);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} max-w-md w-full p-6`}>
        <div className="flex justify-between items-start mb-6">
          <h3 className={isDark ? 'text-white' : 'text-black'}>DESCARGAR TRACK</h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-white' : 'text-black'} hover:opacity-70 transition-opacity`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className={`${isDark ? 'text-white' : 'text-black'} mb-4`}>
            Estás a punto de descargar: <span className="font-black">{trackTitle}</span>
          </p>

          {isPremium ? (
            <div className="bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} p-4">
              <p className="font-black text-black text-center">
                ✓ Descarga premium sin anuncios
              </p>
            </div>
          ) : (
            <div>
              {!adWatched ? (
                <div className="bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} p-4 mb-4">
                  <p className="font-black text-black text-center mb-3">
                    Mira un anuncio para descargar
                  </p>
                  {countdown === 5 ? (
                    <button
                      onClick={handleWatchAd}
                      className={`w-full bg-black text-white border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black`}
                    >
                      VER ANUNCIO
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-black text-4xl font-black">{countdown}</p>
                      <p className="text-black">Publicidad...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} p-4 mb-4">
                  <p className="font-black text-black text-center">
                    ✓ Anuncio completado
                  </p>
                </div>
              )}
              
              <div className={`${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-100'} border-4 ${isDark ? 'border-white' : 'border-black'} p-3`}>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-black'} text-center`}>
                  💡 Con Premium ($50/mes) descarga sin anuncios
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black`}
          >
            CANCELAR
          </button>
          <button
            onClick={handleDownload}
            disabled={!isPremium && !adWatched}
            className={`flex-1 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0`}
          >
            <Download className="w-5 h-5" />
            DESCARGAR
          </button>
        </div>
      </div>
    </div>
  );
}
