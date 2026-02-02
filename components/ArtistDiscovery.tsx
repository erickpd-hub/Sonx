import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserPlus } from "lucide-react";

interface Artist {
  id: string;
  username: string;
  avatar: string;
  genre: string;
  followers: number;
}

interface ArtistDiscoveryProps {
  artists: Artist[];
  isDark: boolean;
  onFollowArtist: (artistId: string) => void;
  onArtistClick: (artistId: string) => void;
}

export function ArtistDiscovery({ artists, isDark, onFollowArtist, onArtistClick }: ArtistDiscoveryProps) {
  return (
    <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-4 sticky top-24`}>
      <h4 className={`${isDark ? 'text-white' : 'text-black'} mb-4`}>DESCUBRE ARTISTAS</h4>
      
      <div className="space-y-3">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className={`flex items-center gap-3 p-3 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}
          >
            <button
              onClick={() => onArtistClick(artist.id)}
              className={`w-12 h-12 border-2 ${isDark ? 'border-white' : 'border-black'} flex-shrink-0`}
            >
              <ImageWithFallback
                src={artist.avatar}
                alt={artist.username}
                className="w-full h-full object-cover"
              />
            </button>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onArtistClick(artist.id)}
                className={`font-black ${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors truncate block w-full text-left`}
              >
                {artist.username}
              </button>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-black'} opacity-70 truncate`}>
                {artist.genre}
              </p>
              <p className={`text-xs ${isDark ? 'text-white' : 'text-black'} opacity-50`}>
                {artist.followers} seguidores
              </p>
            </div>
            <button
              onClick={() => onFollowArtist(artist.id)}
              className={`w-8 h-8 bg-[var(--color-brutal-yellow)] border-2 ${isDark ? 'border-white' : 'border-black'} flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0`}
            >
              <UserPlus className="w-4 h-4 text-black" />
            </button>
          </div>
        ))}
      </div>

      <button className={`w-full mt-4 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-2 font-black`}>
        VER MÁS
      </button>
    </div>
  );
}
