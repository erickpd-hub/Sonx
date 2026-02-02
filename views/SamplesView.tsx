import { useState } from "react";
import { SampleFilters } from "../components/SampleFilters";
import { TrackList } from "../components/TrackList";

interface SamplesViewProps {
    isDark: boolean;
    isPremium: boolean;
    mockSamples: any[];
    likedTrackIds: string[];
    onPlayTrack: (track: any, context?: any[]) => void;
    onLikeTrack: (id: string) => void;
    onDownloadTrack: (id: string) => void;
}

export function SamplesView({
    isDark,
    isPremium,
    mockSamples,
    likedTrackIds,
    onPlayTrack,
    onLikeTrack,
    onDownloadTrack,
}: SamplesViewProps) {
    const [sampleFilters, setSampleFilters] = useState({
        bpm: "Todos",
        note: "Todos",
        type: "Todos",
        genre: "Todos",
    });

    return (
        <div>
            <div className="mb-8">
                <div className={`inline-block bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className="text-black">SAMPLES GRATIS</h1>
                </div>
                <p className={isDark ? 'text-white' : 'text-black'}>
                    {isPremium
                        ? "Descarga samples ilimitados con tu cuenta Premium"
                        : "Samples gratuitos para usar en tus producciones. Premium = descargas sin anuncios"}
                </p>
            </div>

            <SampleFilters
                isDark={isDark}
                filters={sampleFilters}
                onFilterChange={setSampleFilters}
            />

            <TrackList
                tracks={mockSamples}
                onPlayTrack={onPlayTrack}
                onLikeTrack={onLikeTrack}
                onDownloadTrack={onDownloadTrack}
                isDark={isDark}
                likedTracks={likedTrackIds}
            />
        </div>
    );
}
