import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, X, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useRef, useEffect } from "react";

interface PlayerProps {
  currentSong?: {
    id: string;
    title: string;
    artist: string;
    image: string;
    mediaUrl?: string;
    media_url?: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  isDark: boolean;
  isLiked?: boolean;
  onLike?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  isShuffled: boolean;
  repeatMode: 'none' | 'all' | 'one';
}

export function Player({ currentSong, isPlaying, onPlayPause, onClose, isDark, isLiked, onLike, onNext, onPrevious, onShuffle, onRepeat, isShuffled, repeatMode }: PlayerProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const url = currentSong.mediaUrl || currentSong.media_url;
      if (url) {
        audioRef.current.src = url;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback error:", e));
        }
      }
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && duration) {
      const newTime = (newProgress / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 h-24 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-[var(--color-brutal-blue)]'} border-t-4 ${isDark ? 'border-white' : 'border-black'} px-6 flex items-center justify-between`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />
      {/* Close Button - Absolute Positioned */}
      <button
        onClick={onClose}
        className={`absolute -top-7 right-4 w-10 h-10 ${isDark ? 'bg-[var(--color-brutal-red)]' : 'bg-[var(--color-brutal-red)]'} border-4 ${isDark ? 'border-white' : 'border-black'} flex items-center justify-center hover:scale-110 transition-transform z-50`}
      >
        <X className="w-6 h-6 text-black" />
      </button>

      {/* Current Song Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className={`w-16 h-16 border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'}`}>
          <ImageWithFallback
            src={currentSong.image}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className={isDark ? 'text-white' : 'text-white'}>{currentSong.title}</h4>
          <p className={`${isDark ? 'text-white' : 'text-white'} opacity-80`}>{currentSong.artist}</p>
        </div>
        {onLike && (
          <button onClick={onLike} className="ml-2 hover:scale-110 transition-transform">
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-[var(--color-brutal-red)] text-[var(--color-brutal-red)]' : isDark ? 'text-white' : 'text-white'}`} />
          </button>
        )}
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 w-2/4">
        <div className="flex items-center gap-4">
          <button
            onClick={onShuffle}
            className={`w-10 h-10 ${isShuffled ? 'bg-[var(--color-brutal-yellow)] text-black' : isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={onPrevious}
            className={`w-10 h-10 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            <SkipBack className={`w-5 h-5 ${isDark ? 'fill-white' : 'fill-black'}`} />
          </button>
          <button
            onClick={onPlayPause}
            className={`w-12 h-12 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black" />
            )}
          </button>
          <button
            onClick={onNext}
            className={`w-10 h-10 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            <SkipForward className={`w-5 h-5 ${isDark ? 'fill-white' : 'fill-black'}`} />
          </button>
          <button
            onClick={onRepeat}
            className={`w-10 h-10 ${repeatMode !== 'none' ? 'bg-[var(--color-brutal-yellow)] text-black' : isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === 'one' && <span className="text-[10px] font-black absolute">1</span>}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className={isDark ? 'text-white' : 'text-white'}>{formatTime(currentTime)}</span>
          <div className={`flex-1 h-3 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} relative cursor-pointer`}>
            <div
              className={`h-full bg-[var(--color-brutal-yellow)] border-r-4 ${isDark ? 'border-white' : 'border-black'}`}
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className={isDark ? 'text-white' : 'text-white'}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 w-1/4 justify-end pr-32">
        <Volume2 className={`w-6 h-6 ${isDark ? 'text-white' : 'text-white'}`} />
        <div className={`w-24 h-3 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} relative`}>
          <div
            className={`h-full bg-[var(--color-brutal-green)] border-r-4 ${isDark ? 'border-white' : 'border-black'}`}
            style={{ width: `${volume}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
