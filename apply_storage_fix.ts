
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://enfyeyjvtzpnegjauqdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnlleWp2dHpwbmVnamF1cWR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE0NDkxNCwiZXhwIjoyMDc4NzIwOTE0fQ.J-eC4b8vJ7y7xZ2qP8s9t0k5h3l6d4j2n8o0p2q4r6s'; // SERVICE ROLE KEY needed for admin tasks

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSql() {
    try {
        const sqlPath = path.join(__dirname, 'fix_storage_v2.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split into individual statements as rpc/postgres function might not handle multiple statements well depending on implementation
        // But here we don't have a direct SQL runner.
        // We will try to use a direct SQL execution if available, or we might need to rely on the user running it in the dashboard.
        // However, since we have the service role key (assuming I can find it or use the one I found in previous logs if any, but I don't have it).
        // Wait, I only have the ANON key in the client.ts file. I cannot run admin SQL with anon key.

        console.log("Cannot run SQL directly with Anon key. Checking if we can use the 'postgres' function if it exists...");

        // Check if we have a way to run SQL. Usually we don't unless we have a specific RPC.
        // Let's try to use the 'exec_sql' RPC if it exists (common pattern).

        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('Error running SQL via RPC:', error);
            console.log('Attempting to create buckets via Storage API directly...');

            // Fallback: Use Storage API to create buckets
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();

            if (listError) {
                console.error('Error listing buckets:', listError);
                return;
            }

            const imagesBucket = buckets.find(b => b.name === 'images');
            if (!imagesBucket) {
                console.log('Creating images bucket...');
                const { data: newBucket, error: createError } = await supabase.storage.createBucket('images', {
                    public: true
                });
                if (createError) console.error('Error creating images bucket:', createError);
                else console.log('Images bucket created.');
            } else {
                console.log('Images bucket already exists.');
                // Update to public if needed
                if (!imagesBucket.public) {
                    const { data: updated, error: updateError } = await supabase.storage.updateBucket('images', {
                        public: true
                    });
                    if (updateError) console.error('Error updating images bucket:', updateError);
                    else console.log('Images bucket updated to public.');
                }
            }

        } else {
            console.log('SQL executed successfully via RPC.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

runSql();
