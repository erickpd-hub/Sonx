import { Play, Heart, Download, Clock, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EditTrackModal } from "./EditTrackModal";

interface Track {
  id: string;
  title: string;
  artist: string;
  artist_id: string; // Ensure this is available in the Track interface
  duration: string;
  plays: number;
  likes: number;
  genre?: string;
  description?: string;
  is_public?: boolean;
  audience?: string;
}

interface TrackListProps {
  tracks: Track[];
  onPlayTrack: (track: Track, context?: Track[]) => void;
  onLikeTrack: (trackId: string) => void;
  onDownloadTrack: (trackId: string) => void;
  isDark: boolean;
  likedTracks: string[];
  isLoading?: boolean;
  currentUserId?: string; // New prop
  onTrackUpdate?: () => void; // Callback to refresh list
}

export function TrackList({ tracks, onPlayTrack, onLikeTrack, onDownloadTrack, isDark, likedTracks, isLoading, currentUserId, onTrackUpdate }: TrackListProps) {
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  if (isLoading) {
    return (
      <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-3 md:p-6`}>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-16 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-gray-100'} animate-pulse`} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center p-2">
      <table className="w-full max-w-6xl border-separate border-spacing-y-3">
        <thead className="text-sm font-black">
          <tr>
            <th className={`p-3 text-left w-[50px] ${isDark ? 'text-white' : 'text-black'}`}>#</th>
            <th className={`p-3 text-left w-[40%] ${isDark ? 'text-white' : 'text-black'}`}>TÍTULO</th>
            <th className={`p-3 text-center w-[30%] ${isDark ? 'text-white' : 'text-black'}`}>ARTISTA</th>
            <th className="p-3 text-center w-[100px]">
              <div className={`flex justify-center ${isDark ? 'text-white' : 'text-black'}`}>
                <Clock className="w-4 h-4" />
              </div>
            </th>
            <th className="p-3 text-right w-[150px]">
              <div className={`flex justify-end ${isDark ? 'text-white' : 'text-black'}`}>
                <Heart className="w-4 h-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            const isLiked = likedTracks.includes(track.id);
            const isOwner = currentUserId === track.artist_id;

            return (
              <tr
                key={track.id}
                className={`group text-sm ${isDark ? 'bg-[var(--color-dark-surface)] text-white' : 'bg-white text-black'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-colors`}
              >
                <td className="p-3 text-left font-bold border-y-2 border-l-2 border-black">
                  <button
                    onClick={() => onPlayTrack(track, tracks)}
                    className="flex items-center justify-start w-full h-full"
                  >
                    <span className="group-hover:hidden">{index + 1}</span>
                    <Play className="w-4 h-4 hidden group-hover:block fill-current" />
                  </button>
                </td>
                <td className="p-3 border-y-2 border-black">
                  <div className="truncate font-black text-base">
                    {track.title}
                  </div>
                </td>
                <td className="p-3 text-center border-y-2 border-black">
                  <div className="truncate font-bold">
                    <Link
                      to={`/profile/${track.artist_id}`}
                      className="font-bold hover:underline hover:text-blue-600 transition-colors"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {track.artist}
                    </Link>
                  </div>
                </td>
                <td className="p-3 text-center border-y-2 border-black">
                  <div className="whitespace-nowrap">
                    {track.duration}
                  </div>
                </td>
                <td className="p-3 text-right border-y-2 border-r-2 border-black">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => onLikeTrack(track.id)}
                      className="flex items-center gap-1.5 hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-black text-black' : 'text-black'}`}
                      />
                      <span className="text-xs font-bold">
                        {track.likes}
                      </span>
                    </button>

                    <button
                      onClick={() => onDownloadTrack(track.id)}
                      className="hover:scale-110 transition-transform text-black"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTrack(track);
                        }}
                        className="hover:scale-110 transition-transform text-black"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingTrack && (
        <EditTrackModal
          isOpen={!!editingTrack}
          onClose={() => setEditingTrack(null)}
          track={editingTrack}
          onUpdate={() => {
            if (onTrackUpdate) onTrackUpdate();
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
}