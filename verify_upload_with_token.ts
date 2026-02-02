
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ5MTQsImV4cCI6MjA3ODcyMDkxNH0.m-qE6LywDPpZ2ENFcqmxXReafVhWK8OHLsF9s2JqEbw';

// Use the token retrieved from the browser
const accessToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkVjVmtYZlF3VHlVQTdxdnUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2VuZnlleWp2dHpwbmVnamF1cWR0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MTNkOWU2Ni0zMWIxLTRkMzYtYjNiMC00MTNiM2I4NDQzY2UiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0NjIxODUxLCJpYXQiOjE3NjQ2MTgyNTEsImVtYWlsIjoiYWRtaW5Ac29ueC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InVzZXJuYW1lIjoiQWRtaW5Vc2VyIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjM4ODM2MDB9XSwic2Vzc2lvbl9pZCI6IjhmYTI0M2ViLTY2MDctNGJiZS1iODc5LTQ4MmE5M2QzYzBiZSIsImlzX2Fub255bW91cyI6ZmFsc2V9.C3K-YYE43DgUHCQ0IyuFZGBsA6zPCjWjsj87NAiorls";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    },
});

async function verifyUpload() {
    console.log("Attempting to upload test file with token...");

    const fileName = `test_token_${Date.now()}.txt`;
    const fileBody = "This is a test file to verify storage with token.";

    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, fileBody, {
            contentType: 'text/plain',
            upsert: true
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
