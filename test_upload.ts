import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
    console.log('Testing upload (authenticated)...');

    // 1. Sign in
    const email = 'test_uploader_secure@gmail.com';
    const password = 'Password123!';

    // Try to sign up first
    let { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        console.log('Signup response:', authError.message);
        // If user exists, try login
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (loginError) {
            console.error('Login failed:', loginError);
            return;
        }
        authData = loginData;
    }

    const userId = authData.user?.id;
    if (!userId) {
        console.error('No user ID');
        return;
    }
    console.log('Logged in as:', userId);

    // 2. Create a dummy file
    const fileName = `test_track_${Date.now()}.txt`;
    const fileContent = 'This is a test track content';
    const filePath = path.join(process.cwd(), fileName);
    fs.writeFileSync(filePath, fileContent);

    // 3. Upload file
    const storagePath = `${userId}/${fileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(storagePath, fs.readFileSync(filePath), {
            contentType: 'text/plain',
            upsert: true
        });

    if (uploadError) {
        console.error('Upload failed:', uploadError);
        // Clean up
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return;
    }
    console.log('Upload successful:', uploadData);

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('tracks')
        .getPublicUrl(storagePath);
    console.log('Public URL:', publicUrl);

    // 5. Insert into Database
    const { data: trackData, error: dbError } = await supabase
        .from('tracks')
        .insert({
            title: 'Test Track',
            artist_id: userId,
            genre: 'Test',
            type: 'music',
            media_url: publicUrl,
            image_url: "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?w=400",
            duration: '0:00',
        })
        .select()
        .single();

    if (dbError) {
        console.error('Database insert failed:', dbError);
    } else {
        console.log('Database insert successful:', trackData);
    }

    // Clean up
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

testUpload();
