
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBucket() {
    console.log("Checking 'images' bucket via public URL...");

    // Try to get a public URL for a dummy file
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl('test.png');

    console.log("Public URL:", data.publicUrl);

    // Fetch the URL
    try {
        const response = await fetch(data.publicUrl);
        console.log("Response status:", response.status);

        // If bucket doesn't exist, Supabase storage usually returns 400 or 404 with specific text
        const text = await response.text();
        console.log("Response body:", text.substring(0, 200));

        if (text.includes("Bucket not found")) {
            console.log("CONCLUSION: Bucket 'images' DOES NOT EXIST.");
        } else if (response.status === 404 || response.status === 400) {
            // If it's just 404 for the file, the bucket might exist.
            // But usually if bucket is missing, we get a specific error.
            console.log("CONCLUSION: File not found, but bucket might exist.");
        } else {
            console.log("CONCLUSION: Bucket likely exists.");
        }

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

checkBucket();
