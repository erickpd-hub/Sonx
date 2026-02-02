import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockTracks = [
    { title: "Flow Supremo", artist: "MC Brutal", album: "Top Hip Hop", duration: "3:42", plays: 15420, likes: 892, genre: "Hip Hop", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Noche de Fuego", artist: "Reggatón Star", album: "Vibras Urbanas", duration: "4:15", plays: 28450, likes: 1240, genre: "Reggaeton", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Synthetic Dreams", artist: "DJ Electron", album: "Electronic Vibes", duration: "5:23", plays: 32100, likes: 1580, genre: "Electronic", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Trap City", artist: "Young Savage", album: "Top Hip Hop", duration: "3:58", plays: 18900, likes: 745, genre: "Trap", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Perreo Intenso", artist: "El Brutal", album: "Vibras Urbanas", duration: "4:31", plays: 42300, likes: 2150, genre: "Reggaeton", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "Bass Drop Heaven", artist: "DJ Electron", album: "Electronic Vibes", duration: "5:42", plays: 25800, likes: 1120, genre: "Electronic", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "Freestyle 101", artist: "MC Brutal", album: "Top Hip Hop", duration: "3:27", plays: 12500, likes: 568, genre: "Hip Hop", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "Ritmo Latino", artist: "Reggatón Star", album: "Vibras Urbanas", duration: "4:05", plays: 38700, likes: 1890, genre: "Reggaeton", type: "music", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

const mockSamples = [
    { title: "Piano Loop 1", artist: "Sample Pack", album: "Free Samples", duration: "0:08", plays: 5200, likes: 340, bpm: "120", note: "C", type: "Melodía", genre: "Sample", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { title: "Drum Pattern A", artist: "Sample Pack", album: "Free Samples", duration: "0:04", plays: 8900, likes: 567, bpm: "140", note: "N/A", type: "Drums", genre: "Sample", media_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
];

async function seed() {
    console.log('Seeding database...');


    const email = `sonx_artist_${Date.now()}@gmail.com`;
    const password = 'password123';

    let userId: string | undefined;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: 'ProducerPro',
                avatar_url: 'https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=100'
            }
        }
    });

    if (authError) {
        console.error('Error creating seed user:', authError);
        return;
    }

    userId = authData.user?.id;
    if (!userId) {
        console.error('No user ID returned');
        return;
    }

    console.log('Created seed user:', userId);

    // 2. Insert Tracks
    const allTracks: any[] = [...mockTracks, ...mockSamples];
    const insertedTrackIds: string[] = [];

    for (const track of allTracks) {
        const { data, error } = await supabase.from('tracks').insert({
            title: track.title,
            artist_id: userId, // Assign all to this seed user
            album: track.album,
            duration: track.duration,
            plays: track.plays,
            likes: track.likes,
            media_url: track.media_url,
            image_url: "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400", // Placeholder
            bpm: track.bpm,
            note: track.note,
            type: track.type,
            genre: track.genre
        }).select().single();

        if (error) console.error('Error inserting track:', track.title, error);
        else {
            console.log('Inserted track:', track.title);
            if (data) insertedTrackIds.push(data.id);
        }
    }

    // 3. Insert Playlists
    const mockPlaylists = [
        { title: "Top Hip Hop 2024", genre: "Hip Hop", type: "music", banner_url: "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=1080" },
        { title: "Vibras Urbanas", genre: "Reggaeton", type: "music", banner_url: "https://images.unsplash.com/photo-1735827168262-551bde1c928b?w=1080" },
        { title: "Electronic Vibes", genre: "Electronic", type: "music", banner_url: "https://images.unsplash.com/photo-1712530967389-e4b5b16b8500?w=1080" },
    ];

    for (const playlist of mockPlaylists) {
        const { data: playlistData, error: playlistError } = await supabase.from('playlists').insert({
            title: playlist.title,
            user_id: userId,
            genre: playlist.genre,
            type: playlist.type,
            banner_url: playlist.banner_url
        }).select().single();

        if (playlistError) {
            console.error('Error inserting playlist:', playlist.title, playlistError);
            continue;
        }
        console.log('Inserted playlist:', playlist.title);

        // Add some tracks to this playlist
        if (insertedTrackIds.length > 0) {
            // Add 3 random tracks
            const tracksToAdd = insertedTrackIds.sort(() => 0.5 - Math.random()).slice(0, 3);
            for (const trackId of tracksToAdd) {
                const { error: ptError } = await supabase.from('playlist_tracks').insert({
                    playlist_id: playlistData.id,
                    track_id: trackId
                });
                if (ptError) console.error('Error adding track to playlist:', ptError);
            }
        }
    }

    console.log('Seeding complete!');
}

seed();
