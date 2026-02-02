import { Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AlbumCardProps {
  title: string;
  artist: string;
  image: string;
  color: string;
  onPlay: () => void;
}

export function AlbumCard({ title, artist, image, color, onPlay }: AlbumCardProps) {
  return (
    <div
      className={`${color} border-4 border-black brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group`}
      onClick={onPlay}
    >
      <div className="aspect-square relative overflow-hidden border-b-4 border-black">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
        <button className="absolute bottom-4 right-4 w-14 h-14 bg-[var(--color-brutal-yellow)] border-4 border-black brutal-shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
          <Play className="w-6 h-6 fill-black" />
        </button>
      </div>
      <div className="p-4">
        <h4 className="mb-1 truncate">{title}</h4>
        <p className="truncate opacity-70">{artist}</p>
      </div>
    </div>
  );
}
