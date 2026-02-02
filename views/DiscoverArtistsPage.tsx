import { useState } from "react";
import { useRecommendedArtists } from "../hooks/useRecommendedArtists";
import { ArtistCard } from "../components/ArtistCard";
import { Loader2 } from "lucide-react";

interface DiscoverArtistsPageProps {
    isDark: boolean;
}

export function DiscoverArtistsPage({ isDark }: DiscoverArtistsPageProps) {
    const { artists, loading } = useRecommendedArtists();
    const [showAll, setShowAll] = useState(false);

    // Initial limit
    const initialLimit = 6;
    const displayedArtists = showAll ? artists : artists.slice(0, initialLimit);

    return (
        <div>
            <div className="mb-8">
                <div className={`inline-block bg-[var(--color-brutal-cyan)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className="text-black font-black text-2xl">DESCUBRE ARTISTAS</h1>
                </div>
                <p className={isDark ? 'text-white' : 'text-black'}>
                    Encuentra y conecta con artistas emergentes basados en tus gustos y ubicación.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white' : 'text-black'}`} />
                </div>
            ) : (
                <>
                    {artists.length === 0 ? (
                        <div className={`p-8 text-center border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'}`}>
                            <p className={isDark ? 'text-white' : 'text-black'}>No se encontraron recomendaciones por ahora.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedArtists.map((artist) => (
                                <ArtistCard key={artist.id} artist={artist} isDark={isDark} />
                            ))}
                        </div>
                    )}

                    {!showAll && artists.length > initialLimit && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowAll(true)}
                                className={`bg-[var(--color-brutal-pink)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-8 py-4 font-black text-black`}
                            >
                                VER MÁS ARTISTAS
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
