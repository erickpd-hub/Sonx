
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyUpload() {
    console.log("Attempting to upload test file...");

    // We need to be authenticated to upload usually, based on the policy:
    // create policy "Authenticated Upload Images" ... with check (auth.role() = 'authenticated');

    // So we need to sign in first.
    // I'll use the seed user credentials if possible, or just try to sign up a temp user.

    const email = `test_upload_${Date.now()}@example.com`;
    const password = 'password123';

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) {
        console.error("Auth error:", authError.message);
        return;
    }

    const userId = authData.user?.id;
    console.log("Authenticated as:", userId);

    const fileName = `test_${Date.now()}.txt`;
    const fileBody = "This is a test file to verify storage.";

    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, fileBody, {
            contentType: 'text/plain'
        });

    if (error) {
        console.error("Upload FAILED:", error.message);
        console.error("Full error:", error);
    } else {
        console.log("Upload SUCCESS:", data);

        // Clean up
        await supabase.storage.from('images').remove([fileName]);
    }
}

verifyUpload();
