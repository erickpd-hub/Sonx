
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

// Use the token retrieved from the browser
const accessToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkVjVmtYZlF3VHlVQTdxdnUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2VuZnlleWp2dHpwbmVnamF1cWR0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MTNkOWU2Ni0zMWIxLTRkMzYtYjNiMC00MTNiM2I4NDQzY2UiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0NjI1MzMwLCJpYXQiOjE3NjQ2MjE3MzAsImVtYWlsIjoiYWRtaW5Ac29ueC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InVzZXJuYW1lIjoiQWRtaW5Vc2VyIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjM4ODM2MDB9XSwic2Vzc2lvbl9pZCI6IjhmYTI0M2ViLTY2MDctNGJiZS1iODc5LTQ4MmE5M2QzYzBiZSIsImlzX2Fub255bW91cyI6ZmFsc2V9.IBocPpLwcRSCy79PXyTk3oD_LIqz8tcZfYp9XKXm1bY";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    },
});

async function verifyProfileUpdate() {
    console.log("Attempting to update profile...");

    // Get current user to know ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("Error getting user:", userError);
        return;
    }
    console.log("User ID:", user.id);

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        // If profile doesn't exist, we might need to create it?
        // But the app assumes it exists.
    } else {
        console.log("Profile found:", profile);
    }

    // Try to update
    const { data, error } = await supabase
        .from('profiles')
        .update({
            avatar_url: "https://example.com/test_avatar.png",
            bio: "This is a test bio updated via script."
        })
        .eq('id', user.id)
        .select();

    if (error) {
        console.error("Profile update FAILED:", error.message);
        console.error("Full error:", error);
    } else {
        console.log("Profile update SUCCESS:", data);
    }
}

verifyProfileUpdate();
