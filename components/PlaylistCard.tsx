import { Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PlaylistCardProps {
  title: string;
  banner: string;
  trackCount: number;
  onClick: () => void;
  isDark: boolean;
}

export function PlaylistCard({ title, banner, trackCount, onClick, isDark }: PlaylistCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group w-full text-left`}
    >
      <div className="aspect-[16/9] relative overflow-hidden border-b-4 ${isDark ? 'border-white' : 'border-black'}">
        <ImageWithFallback
          src={banner}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-4 right-4 w-14 h-14 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
          <Play className="w-6 h-6 fill-black" />
        </div>
      </div>
      <div className="p-4">
        <h4 className={`mb-1 truncate ${isDark ? 'text-white' : 'text-black'}`}>{title}</h4>
        <p className={`truncate ${isDark ? 'text-white' : 'text-black'} opacity-70`}>
          {trackCount} canciones
        </p>
      </div>
    </button>
  );
}
