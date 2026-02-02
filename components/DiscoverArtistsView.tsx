import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserPlus, Music } from "lucide-react";

interface DiscoverArtistsViewProps {
  artists: any[];
  isDark: boolean;
  onFollowArtist: (artistId: string) => void;
  onArtistClick: (artistId: string) => void;
}

export function DiscoverArtistsView({ artists, isDark, onFollowArtist, onArtistClick }: DiscoverArtistsViewProps) {
  return (
    <div>
      <div className="mb-8">
        <div className={`inline-block bg-[var(--color-brutal-cyan)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
          <h1 className="text-black">DESCUBRE ARTISTAS</h1>
        </div>
        <p className={isDark ? 'text-white' : 'text-black'}>
          Encuentra y conecta con artistas emergentes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} overflow-hidden`}
          >
            <div className={`h-32 relative bg-gradient-to-br from-[var(--color-brutal-blue)] to-[var(--color-brutal-green)] border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => onArtistClick(artist.id)}
                  className={`w-20 h-20 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'}`}
                >
                  <ImageWithFallback
                    src={artist.avatar}
                    alt={artist.username}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>

            <div className="pt-12 p-6 text-center">
              <button
                onClick={() => onArtistClick(artist.id)}
                className={`font-black ${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors text-xl mb-2`}
              >
                {artist.username}
              </button>
              <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 mb-1`}>
                {artist.genre}
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>
                  <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>{artist.followers}</p>
                  <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 text-sm`}>seguidores</p>
                </div>
                <div>
                  <p className={`${isDark ? 'text-white' : 'text-black'} font-black`}>{artist.tracks || 24}</p>
                  <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 text-sm`}>tracks</p>
                </div>
              </div>

              <button
                onClick={() => onFollowArtist(artist.id)}
                className={`w-full bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3 font-black text-black flex items-center justify-center gap-2`}
              >
                <UserPlus className="w-5 h-5" />
                SEGUIR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
