import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables manually
// Assuming running from src directory
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envConfig.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNotifications() {
    console.log('🔔 Testing Notifications System...\n');

    // 1. Login as Admin User (Actor)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@sonx.com',
        password: 'admin123'
    });

    if (authError || !authData.user) {
        console.error('❌ Error logging in:', authError);
        return;
    }

    const userB = { id: authData.user.id, username: 'AdminUser' }; // Actor (Logged in user)
    console.log(`Logged in as User B (Actor): ${userB.username} (${userB.id})`);

    // 2. Find a Recipient (User A)
    // We need someone else. Let's find a profile that is NOT the current user.
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .neq('id', userB.id)
        .limit(1);

    if (!profiles || profiles.length === 0) {
        console.error('❌ Error: Need at least 1 other user to test notifications.');
        return;
    }

    const userA = profiles[0]; // Recipient
    console.log(`User A (Recipient): ${userA.username} (${userA.id})`);

    // 3. Test Like Notification
    console.log('\n--- Testing Like Notification ---');
    // User B likes User A's track
    const { data: tracks } = await supabase
        .from('tracks')
        .select('id, title')
        .eq('artist_id', userA.id)
        .limit(1);

    if (tracks && tracks.length > 0) {
        const track = tracks[0];
        console.log(`User B liking track "${track.title}"...`);

        // Insert like
        const { error: likeError } = await supabase
            .from('track_likes')
            .insert({ user_id: userB.id, track_id: track.id });

        if (likeError) {
            if (likeError.code === '23505') { // Unique violation
                console.log('Track already liked, unliking first...');
                await supabase.from('track_likes').delete().eq('user_id', userB.id).eq('track_id', track.id);
                // Try again
                await supabase.from('track_likes').insert({ user_id: userB.id, track_id: track.id });
            } else {
                console.error('Error liking track:', likeError);
            }
        }

        // Check for notification
        console.log('Action performed. Verifying via side-effect (if possible) or assuming success if no error.');

    } else {
        console.log('Skipping Like Test: User A has no tracks.');
    }

    // 4. Test Follow Notification
    console.log('\n--- Testing Follow Notification ---');
    console.log(`User B following User A...`);

    const { error: followError } = await supabase
        .from('follows')
        .insert({ follower_id: userB.id, following_id: userA.id });

    if (followError) {
        if (followError.code === '23505') {
            console.log('Already following, unfollowing first...');
            await supabase.from('follows').delete().eq('follower_id', userB.id).eq('following_id', userA.id);
            await supabase.from('follows').insert({ follower_id: userB.id, following_id: userA.id });
        } else {
            console.error('Error following:', followError);
        }
    } else {
        console.log('✅ Follow action successful (Trigger should have fired)');
    }
}

testNotifications();
