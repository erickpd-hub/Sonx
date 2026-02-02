import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { TrackList } from "../components/TrackList";

interface PlaylistViewProps {
    isDark: boolean;
    mockPlaylists: any[];
    mockTracks: any[];
    likedTrackIds: string[];
    onPlayTrack: (track: any, context?: any[]) => void;
    onLikeTrack: (id: string) => void;
    onDownloadTrack: (id: string) => void;
}

export function PlaylistView({
    isDark,
    mockPlaylists,
    mockTracks,
    likedTrackIds,
    onPlayTrack,
    onLikeTrack,
    onDownloadTrack,
}: PlaylistViewProps) {
    const { id } = useParams();
    const navigate = useNavigate();

    const selectedPlaylist = mockPlaylists.find((p) => p.id === id);

    if (!selectedPlaylist) {
        return <div>Playlist no encontrada</div>;
    }

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-black'} hover:opacity-70 transition-opacity`}
            >
                <ChevronLeft className="w-6 h-6" />
                <span className="font-black">VOLVER</span>
            </button>

            <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} overflow-hidden mb-6`}>
                <div className={`h-48 md:h-64 relative border-b-4 ${isDark ? 'border-white' : 'border-black'}`}>
                    <img
                        src={selectedPlaylist.banner}
                        alt={selectedPlaylist.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 md:p-6">
                    <h2 className={isDark ? 'text-white' : 'text-black'}>{selectedPlaylist.title}</h2>
                    <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70 mt-2`}>
                        {selectedPlaylist.trackCount} canciones • {selectedPlaylist.genre}
                    </p>
                </div>
            </div>

            <TrackList
                tracks={mockTracks}
                onPlayTrack={onPlayTrack}
                onLikeTrack={onLikeTrack}
                onDownloadTrack={onDownloadTrack}
                isDark={isDark}
                likedTracks={likedTrackIds}
            />
        </div>
    );
}
