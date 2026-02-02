import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsername(username: string) {
    console.log(`Checking username: "${username}"...`);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            console.log(`❌ Username "${username}" is UNAVAILABLE (Found in DB)`);
        } else {
            console.log(`✅ Username "${username}" is AVAILABLE (Not found in DB)`);
        }
    } catch (error: any) {
        console.error('Error checking username:', error.message);
    }
}

async function runTests() {
    console.log('--- Testing Username Availability Logic ---');

    // Test with a username that definitely exists (from seed data)
    // Assuming 'ProducerPro' exists from previous tests
    await checkUsername('ProducerPro');

    // Test with a username that definitely does not exist
    await checkUsername('non_existent_user_' + Date.now());

    console.log('--- Test Complete ---');
}

runTests();
