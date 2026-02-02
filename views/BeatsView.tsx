import { useNavigate } from "react-router-dom";
import { GenreCard } from "../components/GenreCard";
import { beatGenres } from "../data/genres";

interface BeatsViewProps {
    isDark: boolean;
}

export function BeatsView({ isDark }: BeatsViewProps) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-8">
                <div className={`inline-block bg-[var(--color-brutal-orange)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className="text-black">BEATS</h1>
                </div>
                <p className={isDark ? 'text-white' : 'text-black'}>
                    Encuentra el beat perfecto para tu proyecto
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {beatGenres.map((genre) => (
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
