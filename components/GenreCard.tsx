import { ChevronRight } from "lucide-react";

interface GenreCardProps {
  name: string;
  color: string;
  playlistCount: number;
  onClick: () => void;
  isDark: boolean;
}

export function GenreCard({ name, color, playlistCount, onClick, isDark }: GenreCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-6 text-left group w-full`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={isDark ? 'text-white' : 'text-black'}>{name}</h3>
          <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 mt-2`}>
            {playlistCount} playlists
          </p>
        </div>
        <ChevronRight className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'} group-hover:translate-x-2 transition-transform`} />
      </div>
    </button>
  );
}
