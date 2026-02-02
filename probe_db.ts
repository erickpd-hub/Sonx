import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function probeDatabase() {
    const tables = ['tracks', 'playlists', 'posts', 'profiles', 'genres', 'artists'];
    const results: Record<string, any> = {};

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            results[table] = { exists: false, error: error.message };
        } else {
            results[table] = { exists: true, count: data?.length };
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

probeDatabase();
