import { useNavigate } from "react-router-dom";
import { GenreCard } from "../components/GenreCard";
import { musicGenres } from "../data/genres";

interface MusicViewProps {
    isDark: boolean;
}

export function MusicView({ isDark }: MusicViewProps) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-8">
                <div className={`inline-block bg-[var(--color-brutal-blue)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className="text-white">MÚSICA</h1>
                </div>
                <p className={isDark ? 'text-white' : 'text-black'}>
                    Explora música por géneros
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {musicGenres.map((genre) => (
                    <GenreCard
                        key={genre.id}
                        name={genre.name}
                        color={genre.color}
                        playlistCount={genre.playlistCount}
                        onClick={() => navigate(`/genre/${genre.id}`)}
                        isDark={isDark}
                    />
                ))}
            </div>
        </div>
    );
}
