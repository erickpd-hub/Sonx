
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixNegativeLikes() {
    // 1. Find tracks with negative likes
    const { data: negativeTracks, error: findError } = await supabase
        .from('tracks')
        .select('id, title, likes')
        .lt('likes', 0);

    if (findError) {
        console.error('Error finding negative likes:', findError);
        return;
    }

    console.log('Tracks with negative likes:', negativeTracks);

    if (negativeTracks && negativeTracks.length > 0) {
        for (const track of negativeTracks) {
            console.log(`Fixing track ${track.id} (${track.title}) with likes: ${track.likes}`);
            const { error: updateError } = await supabase
                .from('tracks')
                .update({ likes: 0 })
                .eq('id', track.id);

            if (updateError) {
                console.error(`Error updating track ${track.id}:`, updateError);
            } else {
                console.log(`Fixed track ${track.id}`);
            }
        }
    } else {
        console.log('No tracks with negative likes found.');
    }
}

fixNegativeLikes();
