export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  banner?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre: string;
  type: 'music' | 'beat' | 'sample';
  duration: string;
  image: string;
  audioUrl: string;
  plays: number;
  likes: number;
  createdAt: string;
  price?: number;
}

export interface Playlist {
  id: string;
  title: string;
  genre: string;
  type: 'music' | 'beat';
  banner: string;
  trackCount: number;
  tracks: Track[];
  createdAt: string;
}

export interface Genre {
  id: string;
  name: string;
  type: 'music' | 'beat';
  color: string;
  playlists: Playlist[];
}

export interface Collaboration {
  id: string;
  trackId: string;
  track: Track;
  collaborators: User[];
  createdAt: string;
}
