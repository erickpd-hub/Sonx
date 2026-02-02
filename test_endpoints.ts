import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEndpoints() {
    console.log('Testing Supabase Endpoints...');

    try {
        // 1. Fetch Tracks
        console.log('\n1. Fetching Tracks...');
        const { data: tracks, error: tracksError } = await supabase
            .from('tracks')
            .select('*')
            .limit(5);

        if (tracksError) throw tracksError;
        console.log(`✅ Success: Fetched ${tracks.length} tracks`);
        if (tracks.length > 0) console.log('Sample Track:', tracks[0].title);

        // 2. Fetch Playlists
        console.log('\n2. Fetching Playlists...');
        const { data: playlists, error: playlistsError } = await supabase
            .from('playlists')
            .select('*')
            .limit(5);

        if (playlistsError) throw playlistsError;
        console.log(`✅ Success: Fetched ${playlists.length} playlists`);
        if (playlists.length > 0) console.log('Sample Playlist:', playlists[0].title);

        // 3. Fetch Posts
        console.log('\n3. Fetching Posts...');
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .limit(5);

        if (postsError) throw postsError;
        console.log(`✅ Success: Fetched ${posts.length} posts`);
        if (posts.length > 0) console.log('Sample Post ID:', posts[0].id);

        // 4. Fetch Profiles (Public)
        console.log('\n4. Fetching Profiles...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profilesError) throw profilesError;
        console.log(`✅ Success: Fetched ${profiles.length} profiles`);
        if (profiles.length > 0) console.log('Sample Profile:', profiles[0].username);

    } catch (error: any) {
        console.error('❌ Error testing endpoints:', error.message);
        process.exit(1);
    }
}

testEndpoints();
