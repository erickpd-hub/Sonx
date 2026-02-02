import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PlaylistCard } from "../components/PlaylistCard";
import { musicGenres, beatGenres } from "../data/genres";

interface GenreViewProps {
    isDark: boolean;
    mockPlaylists: any[];
}

export function GenreView({ isDark, mockPlaylists }: GenreViewProps) {
    const { id } = useParams();
    const navigate = useNavigate();

    const genre = [...musicGenres, ...beatGenres].find((g) => g.id === id);

    if (!genre) {
        return <div>Género no encontrado</div>;
    }

    const filteredPlaylists = mockPlaylists.filter(p => p.genre === genre.name);

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-black'} hover:opacity-70 transition-opacity`}
            >
                <ChevronLeft className="w-6 h-6" />
                <span className="font-black">VOLVER</span>
            </button>

            <div className="mb-8">
                <div className={`inline-block ${genre.color} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className={isDark ? 'text-white' : 'text-black'}>{genre.name}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map((playlist: any) => (
                        <PlaylistCard
                            key={playlist.id}
                            title={playlist.title}
                            banner={playlist.banner}
                            trackCount={playlist.trackCount}
                            onClick={() => navigate(`/playlist/${playlist.id}`)}
                            isDark={isDark}
                        />
                    ))
                ) : (
                    <p className={isDark ? 'text-white' : 'text-black'}>No hay playlists disponibles para este género.</p>
                )}
            </div>
        </div>
    );
}
