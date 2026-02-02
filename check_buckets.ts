
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Checking buckets...");
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error.message);
    } else {
        console.log('Buckets found:', data.map(b => b.name));
        const images = data.find(b => b.name === 'images');
        if (images) {
            console.log('Images bucket exists. Public:', images.public);
        } else {
            console.log('Images bucket DOES NOT exist.');
        }
    }
}

check();
